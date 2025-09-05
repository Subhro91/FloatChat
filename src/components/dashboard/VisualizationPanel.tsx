import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Line } from 'react-chartjs-2';
import Map from "@/components/Map";
import { Bot } from "lucide-react";
import { Visualization } from "@/pages/Dashboard"; // Assuming types are exported from Dashboard

interface VisualizationPanelProps {
  visualizations: Visualization | null;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ visualizations }) => {
  return (
    <ScrollArea className="h-full p-6 space-y-6">
      {!visualizations ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold text-primary mb-2">FloatChat Dashboard</h2>
            <p className="text-muted-foreground">Ask a question to begin exploring oceanographic data</p>
          </div>
        </div>
      ) : (
        <>
          {/* Float Locations Card */}
          <Card className="glow-on-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Float Locations
                <span className="text-sm font-normal text-muted-foreground">
                  ({visualizations.mapPoints.length} floats found)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 bg-gradient-surface rounded-lg overflow-hidden">
                <Map points={visualizations.mapPoints} />
              </div>
            </CardContent>
          </Card>

          {/* Data Profile Card */}
          <Card className="glow-on-hover">
            <CardHeader>
              <CardTitle>Temperature Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <Line 
                  data={visualizations.chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: 'hsl(210 40% 95%)'
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: !!visualizations.chartData.xAxisLabel,
                          text: visualizations.chartData.xAxisLabel || '',
                          color: 'hsl(210 40% 95%)'
                        },
                        ticks: { color: 'hsl(217 10% 65%)' },
                        grid: { color: 'hsl(215 28% 15%)' }
                      },
                      y: {
                        title: {
                          display: !!visualizations.chartData.yAxisLabel,
                          text: visualizations.chartData.yAxisLabel || '',
                          color: 'hsl(210 40% 95%)'
                        },
                        ticks: { color: 'hsl(217 10% 65%)' },
                        grid: { color: 'hsl(215 28% 15%)' }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </ScrollArea>
  );
};

export default VisualizationPanel;
