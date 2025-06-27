import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { withPageTitle } from '@/components/withPageTitle';
import { useState } from "react";

function Reports() {
  const [selectedDateRange, setSelectedDateRange] = useState("last30days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedTab, setSelectedTab] = useState("sales");

  // Mock data for reports
  const salesMetrics = {
    totalRevenue: 847500,
    revenueGrowth: 23.5,
    dealsWon: 28,
    dealsLost: 12,
    conversionRate: 68.5,
    avgDealSize: 32450,
    salesCycle: 45,
    pipelineValue: 1250000
  };

  const monthlyData = [
    { month: "Jan", revenue: 65000, deals: 5, leads: 120 },
    { month: "Feb", revenue: 72000, deals: 6, leads: 135 },
    { month: "Mar", revenue: 68000, deals: 4, leads: 110 },
    { month: "Apr", revenue: 85000, deals: 7, leads: 150 },
    { month: "May", revenue: 92000, deals: 8, leads: 165 },
    { month: "Jun", revenue: 88000, deals: 6, leads: 140 },
    { month: "Jul", revenue: 95000, deals: 9, leads: 175 },
    { month: "Aug", revenue: 102000, deals: 10, leads: 185 },
    { month: "Sep", revenue: 98000, deals: 8, leads: 170 },
    { month: "Oct", revenue: 115000, deals: 12, leads: 200 },
    { month: "Nov", revenue: 125000, deals: 14, leads: 220 },
    { month: "Dec", revenue: 89000, deals: 8, leads: 180 }
  ];

  const topPerformers = [
    { name: "John Doe", deals: 15, revenue: 245000, target: 200000, achievement: 122.5 },
    { name: "Sarah Smith", deals: 12, revenue: 198000, target: 180000, achievement: 110.0 },
    { name: "Mike Johnson", deals: 10, revenue: 156000, target: 150000, achievement: 104.0 },
    { name: "Emily Davis", deals: 8, revenue: 134000, target: 140000, achievement: 95.7 },
    { name: "David Wilson", deals: 6, revenue: 98000, target: 120000, achievement: 81.7 }
  ];

  const leadSources = [
    { source: "Website", leads: 145, percentage: 35, deals: 23 },
    { source: "Referrals", leads: 98, percentage: 24, deals: 19 },
    { source: "LinkedIn", leads: 76, percentage: 18, deals: 12 },
    { source: "Cold Email", leads: 54, percentage: 13, deals: 8 },
    { source: "Events", leads: 32, percentage: 8, deals: 6 },
    { source: "Other", leads: 9, percentage: 2, deals: 2 }
  ];

  const industryBreakdown = [
    { industry: "Technology", deals: 45, revenue: 325000, percentage: 38.4 },
    { industry: "Healthcare", deals: 23, revenue: 198000, percentage: 23.3 },
    { industry: "Finance", deals: 18, revenue: 156000, percentage: 18.4 },
    { industry: "Manufacturing", deals: 12, revenue: 98000, percentage: 11.6 },
    { industry: "Retail", deals: 8, revenue: 70500, percentage: 8.3 }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, positive = true }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <Badge variant="secondary" className={`text-xs ${positive ? 'text-green-600' : 'text-red-600'}`}>
                  {positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {change}%
                </Badge>
              )}
            </div>
          </div>
          <Icon className={`h-8 w-8 ${positive ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </CardContent>
    </Card>
  );

  const ChartPlaceholder = ({ title, type }: { title: string; type: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button variant="outline" size="sm">
            <Download size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-20 text-muted-foreground">
          {type === "bar" && <BarChart3 className="h-16 w-16 mx-auto mb-4" />}
          {type === "pie" && <PieChart className="h-16 w-16 mx-auto mb-4" />}
          {type === "line" && <LineChart className="h-16 w-16 mx-auto mb-4" />}
          <h3 className="font-medium text-lg mb-2">{title} Chart</h3>
          <p>Interactive chart would be displayed here using Recharts</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track performance and gain insights into your sales operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filter
          </Button>
          <Button className="gap-2">
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${salesMetrics.totalRevenue.toLocaleString()}`}
          change={salesMetrics.revenueGrowth}
          icon={DollarSign}
        />
        <MetricCard
          title="Deals Won"
          value={salesMetrics.dealsWon}
          change={15.2}
          icon={Target}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${salesMetrics.conversionRate}%`}
          change={5.8}
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg Deal Size"
          value={`$${salesMetrics.avgDealSize.toLocaleString()}`}
          change={8.3}
          icon={DollarSign}
        />
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartPlaceholder title="Monthly Revenue Trend" type="line" />
            <ChartPlaceholder title="Deal Stage Distribution" type="pie" />
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{salesMetrics.dealsWon}</p>
                      <p className="text-sm text-muted-foreground">Deals Won</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{salesMetrics.dealsLost}</p>
                      <p className="text-sm text-muted-foreground">Deals Lost</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{salesMetrics.salesCycle}</p>
                      <p className="text-sm text-muted-foreground">Avg Sales Cycle (days)</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${(salesMetrics.pipelineValue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-muted-foreground">Pipeline Value</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {industryBreakdown.slice(0, 5).map((industry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{industry.industry}</p>
                        <p className="text-xs text-muted-foreground">{industry.deals} deals</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${(industry.revenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">{industry.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartPlaceholder title="Monthly Sales Comparison" type="bar" />
            <ChartPlaceholder title="Revenue by Product" type="pie" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Revenue</th>
                      <th>Deals Closed</th>
                      <th>Leads Generated</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((month, index) => (
                      <tr key={index}>
                        <td className="font-medium">{month.month}</td>
                        <td>${month.revenue.toLocaleString()}</td>
                        <td>{month.deals}</td>
                        <td>{month.leads}</td>
                        <td>{((month.deals / month.leads) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartPlaceholder title="Team Performance" type="bar" />
            <ChartPlaceholder title="Individual vs Target" type="line" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">{performer.deals} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${performer.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={performer.achievement >= 100 ? 'text-green-600' : 'text-orange-600'}
                        >
                          {performer.achievement}% of target
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartPlaceholder title="Pipeline Velocity" type="line" />
            <ChartPlaceholder title="Deal Stage Progression" type="bar" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">${(salesMetrics.pipelineValue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% from last month
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{salesMetrics.salesCycle}</p>
                  <p className="text-sm text-muted-foreground">Avg Sales Cycle (days)</p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
                    -5 days improved
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{salesMetrics.conversionRate}%</p>
                  <p className="text-sm text-muted-foreground">Pipeline Conversion</p>
                  <Badge variant="secondary" className="mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.2% this quarter
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartPlaceholder title="Lead Sources Distribution" type="pie" />
            <ChartPlaceholder title="Source Conversion Rates" type="bar" />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{source.source}</p>
                        <p className="text-sm text-muted-foreground">{source.percentage}% of total</p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <p className="font-medium">{source.leads} leads</p>
                      <p className="text-sm text-muted-foreground">{source.deals} deals</p>
                      <p className="text-xs text-green-600">
                        {((source.deals / source.leads) * 100).toFixed(1)}% conversion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withPageTitle(Reports, 'reports');
