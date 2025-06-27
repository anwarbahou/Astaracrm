import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { withPageTitle } from '@/components/withPageTitle';
import { AddClientModal } from "@/components/modals/AddClientModal";
import { AddContactModal } from "@/components/modals/AddContactModal";
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { arSA } from 'date-fns/locale/ar-SA';

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);

  // Mock data for demo purposes
  const stats = [
    {
      title: t("dashboard.totalRevenue"),
      value: "2,847,500 MAD",
      change: "+12.5%",
      trend: "up",
      description: t("dashboard.vsLastMonth")
    },
    {
      title: t("dashboard.activeClients"),
      value: "247",
      change: "+3.2%",
      trend: "up",
      description: t("dashboard.vsLastMonth")
    },
    {
      title: t("dashboard.dealsInPipeline"),
      value: "89",
      change: "-2.1%",
      trend: "down",
      description: t("dashboard.vsLastMonth")
    },
    {
      title: t("dashboard.tasksDueToday"),
      value: "12",
      change: "+5",
      trend: "up",
      description: t("dashboard.vsYesterday")
    }
  ];

  const recentDeals = [
    { id: 1, client: "Acme Corp", value: "125,000 MAD", status: t("dashboard.status.negotiation"), probability: 75 },
    { id: 2, client: "Tech Solutions", value: "87,500 MAD", status: t("dashboard.status.proposal"), probability: 60 },
    { id: 3, client: "Global Industries", value: "245,000 MAD", status: t("dashboard.status.qualified"), probability: 90 },
    { id: 4, client: "StartupXYZ", value: "52,000 MAD", status: t("dashboard.status.discovery"), probability: 40 }
  ];

  const taskDate = new Date();
  const tomorrow = new Date(taskDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingTasks = [
    { id: 1, title: t("dashboard.mockTasks.followUp"), due: taskDate, priority: "high" },
    { id: 2, title: t("dashboard.mockTasks.prepareProposal"), due: tomorrow, priority: "medium" },
    { id: 3, title: t("dashboard.mockTasks.scheduleDemo"), due: new Date(2025, 11, 16, 15, 0), priority: "low" },
    { id: 4, title: t("dashboard.mockTasks.sendContract"), due: new Date(2025, 11, 17, 9, 0), priority: "high" }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

    const diffInDays = diffInSeconds / (60 * 60 * 24);
    if (diffInDays > 7) {
      return date.toLocaleDateString(i18n.language);
    }
    if (diffInDays >= 1) {
      return rtf.format(-Math.floor(diffInDays), 'day');
    }
    
    const diffInHours = diffInSeconds / (60 * 60);
    if (diffInHours >= 1) {
      return rtf.format(-Math.floor(diffInHours), 'hour');
    }

    const diffInMinutes = diffInSeconds / 60;
    if (diffInMinutes >= 1) {
      return rtf.format(-Math.floor(diffInMinutes), 'minute');
    }
    
    return rtf.format(-Math.floor(diffInSeconds), 'second');
  };

  const now = new Date();
  const recentActivities = [
    { id: 1, action: t("dashboard.mockActivities.newDeal"), details: t("dashboard.mockActivities.dealDetails"), timestamp: new Date(now.getTime() - (2 * 60 * 60 * 1000)) },
    { id: 2, action: t("dashboard.mockActivities.contactUpdated"), details: t("dashboard.mockActivities.contactDetails"), timestamp: new Date(now.getTime() - (4 * 60 * 60 * 1000)) },
    { id: 3, action: t("dashboard.mockActivities.taskCompleted"), details: t("dashboard.mockActivities.taskDetails"), timestamp: new Date(now.getTime() - (6 * 60 * 60 * 1000)) },
    { id: 4, action: t("dashboard.mockActivities.meetingScheduled"), details: t("dashboard.mockActivities.meetingDetails"), timestamp: new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000)) }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case t("dashboard.status.negotiation"): return "bg-orange-100 text-orange-800";
      case t("dashboard.status.proposal"): return "bg-blue-100 text-blue-800";
      case t("dashboard.status.qualified"): return "bg-green-100 text-green-800";
      case t("dashboard.status.discovery"): return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return t("dashboard.priority.high");
      case "medium": return t("dashboard.priority.medium");
      case "low": return t("dashboard.priority.low");
      default: return priority;
    }
  }

  const getLocale = () => {
    const lang = i18n.language;
    if (lang.startsWith('fr')) return fr;
    if (lang.startsWith('ar')) return arSA;
    return undefined;
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) {
      return t("dashboard.mockTasks.dueToday");
    }
    if (isTomorrow(date)) {
      return t("dashboard.mockTasks.dueTomorrow");
    }
    try {
      return format(date, 'PPp', { locale: getLocale() });
    } catch (e) {
      console.error("Error formatting date:", e);
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 animate-in px-1 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {t("dashboard.welcomeMessage")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setAddContactOpen(true)}
              className="w-full sm:w-auto text-sm"
            >
              <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
              <span className="sm:hidden">{t("dashboard.addContact")}</span>
              <span className="hidden sm:inline">{t("dashboard.addContact")}</span>
            </Button>
            <Button 
              onClick={() => setAddClientOpen(true)}
              className="w-full sm:w-auto text-sm"
            >
              <Plus size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
              <span className="sm:hidden">{t("dashboard.addClient")}</span>
              <span className="hidden sm:inline">{t("dashboard.addClient")}</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-full flex-shrink-0 ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stat.trend === 'up' ? 
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> : 
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    }
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center gap-2">
                  <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Deals */}
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                {t("dashboard.recentDeals")}
              </CardTitle>
              <Button variant="ghost" size="sm" className="w-fit text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t("dashboard.viewAll")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border gap-3 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm sm:text-base">{deal.client}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{deal.value}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Badge className={`${getStatusColor(deal.status)} text-xs`} variant="secondary">
                      {deal.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                {t("dashboard.upcomingTasks")}
              </CardTitle>
              <Button variant="ghost" size="sm" className="w-fit text-xs sm:text-sm">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t("dashboard.viewAll")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border gap-3 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base leading-tight">{task.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{formatDueDate(task.due)}</p>
                  </div>
                  <Badge className={`${getPriorityColor(task.priority)} text-xs w-fit`} variant="secondary">
                    {getPriorityText(task.priority)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities - Full Width */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              {t("dashboard.recentActivities")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg border border-border">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base leading-tight">{activity.action}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">{activity.details}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 mt-1">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AddClientModal open={addClientOpen} onOpenChange={setAddClientOpen} />
      <AddContactModal open={addContactOpen} onOpenChange={setAddContactOpen} />
    </>
  );
}

export default withPageTitle(Dashboard, 'dashboard');
