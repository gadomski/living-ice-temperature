from __future__ import annotations

import csv
from pathlib import Path
from typing import Any, Literal

from geojson_pydantic import Feature, FeatureCollection, Point
from geojson_pydantic.types import Position2D
from pydantic import BaseModel, model_validator


def parse_bool(value: Any) -> bool:
    if value == "NaN":
        return False
    else:
        return bool(value)


class Borehole(BaseModel):
    name: str
    location: str
    region: Literal["East", "West"]
    start_year: int | None
    end_year: int | None
    type: str
    lat: float
    lon: float
    ice_thickness: float
    drilled_depth: float
    original_publication: str
    temperature_path: str | None = None
    grain_size_path: str | None = None
    imp_path: str | None = None

    @model_validator(mode="before")
    @classmethod
    def split_years(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if years_drilled := data.pop("years_drilled", None):
                if years_drilled == "NaN":
                    data["start_year"] = None
                    data["end_year"] = None
                else:
                    if isinstance(years_drilled, str):
                        parts = (
                            years_drilled.replace("—", "-").replace("–", "-").split("-")
                        )
                    else:
                        raise ValueError(
                            f"years_drilled was not a string: {years_drilled}"
                        )
                    data["start_year"] = parts[0]
                    if len(parts) == 1:
                        data["end_year"] = parts[0]
                    elif len(parts) == 2:
                        data["end_year"] = parts[1]
                    else:
                        raise ValueError(
                            f"Too many parts in years_drilled: {years_drilled}"
                        )
        return data

    @classmethod
    def from_csv_path(cls, path: Path) -> list[Borehole]:
        boreholes = []
        with open(path) as f:
            reader = csv.DictReader(
                f,
                fieldnames=[
                    "name",
                    "location",
                    "region",
                    "years_drilled",
                    "type",
                    "lat",
                    "lon",
                    "ice_thickness",
                    "drilled_depth",
                    "temperature",
                    "chemistry",
                    "conductivity",
                    "grain_size",
                    "original_publication",
                ],
            )
            next(reader)  # discard headers
            for row in reader:
                if row["name"]:
                    borehole = Borehole.model_validate(row)
                    borehole.update_csv_paths(path.parent)
                    boreholes.append(borehole)
        return boreholes

    @classmethod
    def to_feature_collection(cls, boreholes: list[Borehole]) -> FeatureCollection:
        return FeatureCollection(
            type="FeatureCollection",
            features=[borehole.to_feature() for borehole in boreholes],
        )

    def to_feature(self) -> Feature:
        return Feature(
            type="Feature",
            geometry=self.to_point(),
            properties=self.model_dump(exclude={"lat", "lon"}),
        )

    def to_point(self) -> Point:
        return Point(type="Point", coordinates=Position2D(self.lon, self.lat))

    def update_csv_paths(self, directory: Path) -> None:
        for path in directory.glob("**/*.csv"):
            relative_path = str(path.relative_to(directory))
            parts = path.stem.split("_")
            if parts[0].lower() == self.name.lower():
                match parts[1]:
                    case "temp":
                        self.temperature_path = relative_path
                    case "grainsize":
                        self.grain_size_path = relative_path
                    case "imp":
                        self.imp_path = relative_path
                    case _:
                        raise NotImplementedError(parts[1])
