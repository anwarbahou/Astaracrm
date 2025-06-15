import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Mail, 
  Phone, 
  Edit,
  Trash2,
  UserPlus,
  Star
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  score: number;
  status: "Hot" | "Warm" | "Cold";
  source: string;
  lastActivity: string;
  dealSize: string;
  location: string;
  companySize: string;
  industry: string;
  engagement: number;
  avatar: string;
  tags: string[];
  assignedTo?: string;
  dateAdded: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  selectedLeads: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function LeadsTable({ leads, onLeadClick, selectedLeads, onSelectionChange }: LeadsTableProps) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof Lead];
    const bValue = b[sortConfig.key as keyof Lead];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const paginatedLeads = sortedLeads.slice(startIndex, startIndex + leadsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(paginatedLeads.map(lead => lead.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectLead = (leadId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedLeads, leadId]);
    } else {
      onSelectionChange(selectedLeads.filter(id => id !== leadId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hot": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Warm": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-green-400";
    if (score >= 70) return "text-amber-400";
    if (score >= 60) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="sticky top-0 bg-white/10 backdrop-blur-xl">
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-white/30"
                />
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="text-white hover:bg-white/10 gap-1"
                >
                  {t("aiLeads.table.headers.leadName")}
                  <ArrowUpDown size={14} />
                </Button>
              </TableHead>
              <TableHead className="text-white">{t("aiLeads.table.headers.company")}</TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="text-white hover:bg-white/10 gap-1"
                >
                  {t("aiLeads.table.headers.status")}
                  <ArrowUpDown size={14} />
                </Button>
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('score')}
                  className="text-white hover:bg-white/10 gap-1"
                >
                  {t("aiLeads.table.headers.aiScore")}
                  <ArrowUpDown size={14} />
                </Button>
              </TableHead>
              <TableHead className="text-white">{t("aiLeads.table.headers.source")}</TableHead>
              <TableHead className="text-white">{t("aiLeads.table.headers.tags")}</TableHead>
              <TableHead className="text-white">{t("aiLeads.table.headers.assignedTo")}</TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('dateAdded')}
                  className="text-white hover:bg-white/10 gap-1"
                >
                  {t("aiLeads.table.headers.dateAdded")}
                  <ArrowUpDown size={14} />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeads.map((lead) => (
              <TableRow
                key={lead.id}
                className="border-white/10 hover:bg-white/5 cursor-pointer group"
                onClick={() => onLeadClick(lead)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedLeads.includes(lead.id)}
                    onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                    className="border-white/30"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={lead.avatar} 
                        alt={lead.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        lead.status === 'Hot' ? 'bg-red-500' : 
                        lead.status === 'Warm' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                    <div>
                      <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-sm text-gray-400">{lead.position}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-white">{lead.company}</div>
                  <div className="text-sm text-gray-400">{lead.industry}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(lead.status)} border`}>
                    {t(`aiLeads.table.statusLabels.${lead.status.toLowerCase()}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${lead.score >= 90 ? 'bg-emerald-400' : 
                            lead.score >= 80 ? 'bg-green-400' : 'bg-amber-400'}`}
                          style={{ width: `${lead.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-300">{lead.source}</div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {lead.tags?.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                    {lead.tags?.length > 2 && (
                      <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                        +{lead.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-300">{lead.assignedTo || t("common.unassigned")}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-300">{lead.dateAdded}</div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-white/20">
                      <DropdownMenuItem className="text-white hover:bg-white/10 gap-2">
                        <Mail size={14} />
                        {t("common.sendEmail")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-white/10 gap-2">
                        <Phone size={14} />
                        {t("common.callLead")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-white/10 gap-2">
                        <UserPlus size={14} />
                        {t("common.assign")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-white/10 gap-2">
                        <Edit size={14} />
                        {t("common.edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 gap-2">
                        <Trash2 size={14} />
                        {t("common.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="text-white hover:bg-white/10 border-white/20"
              >
                {t("aiLeads.pagination.previous")}
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="text-white hover:bg-white/10 border-white/20 data-[state=active]:bg-blue-500/20"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="text-white hover:bg-white/10 border-white/20"
              >
                {t("aiLeads.pagination.next")}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
