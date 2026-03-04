export interface BoreholeProperties {
  name: string;
  location: string;
  region: string;
  start_year: number;
  end_year: number;
  type: string;
  ice_thickness: number | null;
  drilled_depth: number | null;
  temperature: boolean;
  chemistry: boolean;
  conductivity: boolean;
  grain_size: boolean;
  original_publication: string;
}

export interface BoreholeFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: BoreholeProperties;
}

export interface BoreholeCollection {
  type: "FeatureCollection";
  features: BoreholeFeature[];
}
