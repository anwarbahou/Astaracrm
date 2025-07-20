import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Mail, Phone, MoreVertical, Edit, Trash } from 'lucide-react';
import { Client } from '@/types/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientsCardViewProps {
  clients: Client[];
  onClientClick: (client: Client) => void;
  onEditClient?: (client: Client) => void;
  onDeleteClient?: (client: Client) => void;
}

export function ClientsCardView({ clients, onClientClick, onEditClient, onDeleteClient }: ClientsCardViewProps) {
  const { t, i18n } = useTranslation();

  const formatLastInteraction = (dateString: string) => {
    const date = new Date(dateString);
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });
    const now = new Date();
    
    const diffInSecondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSecondsPast < 60) return rtf.format(-diffInSecondsPast, 'second');
    if (diffInSecondsPast < 3600) return rtf.format(-Math.floor(diffInSecondsPast / 60), 'minute');
    if (diffInSecondsPast < 86400) return rtf.format(-Math.floor(diffInSecondsPast / 3600), 'hour');
    const diffInDaysPast = Math.floor(diffInSecondsPast / 86400);
    if (diffInDaysPast < 7) return rtf.format(-diffInDaysPast, 'day');
    if (diffInDaysPast < 30) return rtf.format(-Math.floor(diffInDaysPast / 7), 'week');
    if (diffInDaysPast < 365) return rtf.format(-Math.floor(diffInDaysPast / 30), 'month');
    return rtf.format(-Math.floor(diffInDaysPast / 365), 'year');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'prospect': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('clients.noClients')}</h3>
          <p>{t('clients.noClientsDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {clients.map((client) => (
        <Card 
          key={client.id}
          className="relative hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex flex-col bg-gradient-to-br from-card to-card/50"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 cursor-pointer group" onClick={() => onClientClick(client)}>
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">{client.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{client.industry}</p>
            </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getStageColor(client.stage)} text-white text-xs flex-shrink-0`}>
                  {client.stage}
                </Badge>
                
                {/* 3-dot menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClient?.(client);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('clients.actions.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClient?.(client);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      {t('clients.actions.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-2 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-lg" />
            </div>
            {/* Content wrapper */}
            <div className="relative z-10 flex flex-col flex-1 space-y-2">
                            {/* Contact Info */}
              <div className="space-y-1">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{client.phone}</span>
                  </div>
                )}
              </div>





            {/* Stats and Footer - Always at bottom */}
            <div className="mt-auto pt-4">
              {/* Stats Row */}
              <div className="flex justify-between items-center pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t('clients.table.contacts')}</span>
                  <span className="font-semibold text-sm">{client.contactsCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t('clients.table.dealValue')}</span>
                  <span className="font-semibold text-sm">{formatCurrency(client.totalDealValue)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatLastInteraction(client.lastInteraction)}</span>
                </div>
                <span className="text-xs">{client.owner}</span>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
      );
  } 