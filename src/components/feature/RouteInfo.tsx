import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";

const RouteInfo = ({
  routeData,
  setNextRoute,
  setPreviousRoute,
  disabledNext,
  disabledPrevious,
}: {
  routeData: any;
  setNextRoute: () => void;
  setPreviousRoute: () => void;
  disabledNext: boolean;
  disabledPrevious: boolean;
}) => {
  return (
    <Card className="w-full max-w-[700px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between">
          Route Summary
          <div className="flex gap-2">
            <Button onClick={setPreviousRoute} disabled={disabledPrevious}>
              Previous Route
            </Button>
            <Button onClick={setNextRoute} disabled={disabledNext}>
              Next Route
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            <span className="text-lg font-semibold">
              {formatDuration(routeData?.summary?.duration)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            <span className="text-lg font-semibold">
              {formatDistance(routeData.summary.distance)}
            </span>
          </div>
        </div>
        <ScrollArea className="h-[400px] pr-4">
          {routeData.segments.map((segment: any, segmentIndex: number) => (
            <div key={segmentIndex} className="mb-6 last:mb-0">
              <h2 className="text-lg font-bold mb-2">
                Segment {segmentIndex + 1}
              </h2>
              {segment.steps.map((step: any, stepIndex: number) => (
                <div key={stepIndex} className="mb-4 last:mb-0">
                  <h3 className="font-semibold">{step.instruction}</h3>
                  {step.name !== "-" && (
                    <p className="text-sm text-muted-foreground">{step.name}</p>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{formatDistance(step.distance)}</span>
                    <span>{formatDuration(step.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RouteInfo;

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatDistance = (meters: number) => {
  return `${(meters / 1000).toFixed(2)} km`;
};
