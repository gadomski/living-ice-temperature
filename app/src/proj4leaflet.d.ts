import "leaflet";

declare module "leaflet" {
  namespace Proj {
    class CRS extends L.Class implements L.CRS {
      constructor(srsCode: string, proj4def: string, options?: CRSOptions);
      projection: L.Projection;
      transformation: L.Transformation;
      code: string;
      wrapLng?: [number, number];
      wrapLat?: [number, number];
      infinite: boolean;
      latLngToPoint(latlng: L.LatLngExpression, zoom: number): L.Point;
      pointToLatLng(point: L.PointExpression, zoom: number): L.LatLng;
      project(latlng: L.LatLng | L.LatLngLiteral): L.Point;
      unproject(point: L.PointExpression): L.LatLng;
      scale(zoom: number): number;
      zoom(scale: number): number;
      getProjectedBounds(zoom: number): L.Bounds;
      distance(latlng1: L.LatLngExpression, latlng2: L.LatLngExpression): number;
      wrapLatLng(latlng: L.LatLng): L.LatLng;
      wrapLatLngBounds(bounds: L.LatLngBounds): L.LatLngBounds;
    }

    interface CRSOptions {
      resolutions?: number[];
      origin?: [number, number];
      bounds?: L.Bounds;
      transformation?: L.Transformation;
    }
  }
}
