import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/useUsers';
import { Users, DollarSign, Percent } from 'lucide-react';

interface OwnershipSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface PercentageProposal {
  owner_suggested_percentage?: number;
  subowner_suggested_percentage?: number;
  owner_agreed?: boolean;
  subowner_agreed?: boolean;
  is_finalized?: boolean;
}

export function OwnershipSection({ formData, setFormData }: OwnershipSectionProps) {
  const { t } = useTranslation(['clients', 'common']);
  const { data: users = [] } = useUsers();

  const handleOwnerChange = (userId: string) => {
    setFormData({ ...formData, owner: userId });
  };

  const handleSubownerChange = (userId: string) => {
    setFormData({ ...formData, subowner: userId === 'none' ? '' : userId });
  };

  const handleOwnerEarningsChange = (value: string) => {
    const earnings = parseFloat(value) || 0;
    const subownerEarnings = parseFloat(formData.subowner_earnings || '0');
    const total = earnings + subownerEarnings;
    
    setFormData({
      ...formData,
      owner_earnings: earnings,
      total_earnings: total
    });
  };

  const handleSubownerEarningsChange = (value: string) => {
    const earnings = parseFloat(value) || 0;
    const ownerEarnings = parseFloat(formData.owner_earnings || '0');
    const total = ownerEarnings + earnings;
    
    setFormData({
      ...formData,
      subowner_earnings: earnings,
      total_earnings: total
    });
  };



  const handleDealValueChange = (value: string) => {
    const dealValue = parseFloat(value) || 0;
    const totalEarnings = dealValue * 0.3; // 30% of deal value
    
    // If no subowner is selected, owner gets 30% (full earnings)
    // If subowner is selected, owner gets 15% and subowner gets 15%
    const hasSubowner = formData.subowner && formData.subowner !== 'none';
    const ownerPercentage = hasSubowner ? 50 : 100; // Database constraint: 50%+50%=100% or 100%+0%=100%
    const subownerPercentage = hasSubowner ? 50 : 0; // Database constraint: 50%+50%=100% or 100%+0%=100%
    
    const ownerEarnings = hasSubowner ? (totalEarnings * 15) / 30 : totalEarnings; // 15% or 30% of total earnings
    const subownerEarnings = hasSubowner ? (totalEarnings * 15) / 30 : 0; // 15% or 0% of total earnings
    
    setFormData({
      ...formData,
      total_deal_value: dealValue,
      owner_percentage: ownerPercentage,
      subowner_percentage: subownerPercentage,
      owner_earnings: ownerEarnings,
      subowner_earnings: subownerEarnings,
      total_earnings: totalEarnings
    });
  };

  const handleOwnerSuggestion = (value: string) => {
    const percentage = parseInt(value) || 15;
    setFormData({
      ...formData,
      owner_suggested_percentage: percentage
    });
  };

  const handleSubownerSuggestion = (value: string) => {
    const percentage = parseInt(value) || 15;
    setFormData({
      ...formData,
      subowner_suggested_percentage: percentage
    });
  };

  const handleOwnerAgreement = (agreed: boolean) => {
    setFormData({
      ...formData,
      owner_agreed: agreed
    });
  };

  const handleSubownerAgreement = (agreed: boolean) => {
    setFormData({
      ...formData,
      subowner_agreed: agreed
    });
  };

  const finalizePricing = () => {
    const dealValue = parseFloat(formData.total_deal_value || '0');
    const totalEarnings = dealValue * 0.3;
    
    // If no subowner is selected, owner gets 30% (full earnings)
    // If subowner is selected, owner gets 15% and subowner gets 15%
    const hasSubowner = formData.subowner && formData.subowner !== 'none';
    const ownerPercentage = hasSubowner ? 50 : 100; // Database constraint: 50%+50%=100% or 100%+0%=100%
    const subownerPercentage = hasSubowner ? 50 : 0; // Database constraint: 50%+50%=100% or 100%+0%=100%
    
    const ownerEarnings = hasSubowner ? (totalEarnings * 15) / 30 : totalEarnings; // 15% or 30% of total earnings
    const subownerEarnings = hasSubowner ? (totalEarnings * 15) / 30 : 0; // 15% or 0% of total earnings
    
    setFormData({
      ...formData,
      is_finalized: true,
      owner_percentage: ownerPercentage,
      subowner_percentage: subownerPercentage,
      owner_earnings: ownerEarnings,
      subowner_earnings: subownerEarnings,
      total_earnings: totalEarnings
    });
  };

  const getUserDisplayName = (user: any) => {
    if (!user) return 'Select user';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName} ${lastName}`.trim() || user.email;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t('clients.ownership.title', 'Ownership & Earnings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Owner Selection */}
        <div className="space-y-2">
          <Label htmlFor="owner">{t('clients.ownership.owner', 'Primary Owner')}</Label>
          <Select value={formData.owner || ''} onValueChange={handleOwnerChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('clients.ownership.selectOwner', 'Select primary owner')} />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {getUserDisplayName(user)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email} • {user.role}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subowner Selection */}
        <div className="space-y-2">
          <Label htmlFor="subowner">{t('clients.ownership.subowner', 'Secondary Owner')}</Label>
          <Select value={formData.subowner || 'none'} onValueChange={handleSubownerChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('clients.ownership.selectSubowner', 'Select secondary owner (optional)')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('clients.ownership.noSubowner', 'No secondary owner')}</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {getUserDisplayName(user)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email} • {user.role}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>



        {/* Deal Value Input */}
        <div className="space-y-2">
          <Label htmlFor="deal_value" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t('clients.ownership.dealValue', 'Deal Value')} (MAD)
          </Label>
          <div className="relative">
            <Input
              id="deal_value"
              type="number"
              step="0.01"
              min="0"
              value={formData.total_deal_value || ''}
              onChange={(e) => handleDealValueChange(e.target.value)}
              placeholder="0.00"
              className="pr-12"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-sm text-muted-foreground">MAD</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('clients.ownership.earningsNote', 'Earnings will be calculated as 30% of the deal value')}
          </p>
          {formData.total_deal_value && formData.total_deal_value > 0 && (
            <p className="text-xs text-green-600 font-medium">
              Deal Value: {Number(formData.total_deal_value).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} MAD
            </p>
          )}
        </div>

        {/* Total Earnings Display */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t('clients.ownership.totalEarnings', 'Total Earnings (30% of Deal Value)')}
          </Label>
          <div className="p-3 bg-muted rounded-md">
            <span className="text-lg font-semibold text-primary">
              {Number(formData.total_earnings || 0).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} MAD
            </span>
          </div>
        </div>

        {/* Percentage Distribution */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              {t('clients.ownership.ownerPercentage', 'Owner Percentage')}
            </Label>
            <Input
              value={formData.subowner && formData.subowner !== 'none' ? "15" : "30"}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-sm text-muted-foreground">
              {t('clients.ownership.ownerEarnings', 'Owner will get')}: {Number(formData.owner_earnings || 0).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })} MAD
            </p>
          </div>

          {formData.subowner && formData.subowner !== 'none' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                {t('clients.ownership.subownerPercentage', 'Subowner Percentage')}
              </Label>
              <Input
                value="15"
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground">
                {t('clients.ownership.subownerEarnings', 'Subowner will get')}: {Number(formData.subowner_earnings || 0).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })} MAD
              </p>
            </div>
          )}
        </div>

        {/* Percentage Negotiation System */}
        {formData.subowner && formData.subowner !== 'none' && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold text-sm">
              {t('clients.ownership.negotiation.title', 'Percentage Negotiation')}
            </h4>
            
            {/* Owner Suggestion */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('clients.ownership.negotiation.ownerSuggestion', 'Owner Suggestion')}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.owner_suggested_percentage || ''}
                  onChange={(e) => handleOwnerSuggestion(e.target.value)}
                  placeholder="0-30"
                  className="flex-1"
                />
                <Button
                  variant={formData.owner_agreed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleOwnerAgreement(!formData.owner_agreed)}
                >
                  {formData.owner_agreed ? t('clients.ownership.negotiation.agreed', 'Agreed') : t('clients.ownership.negotiation.agree', 'Agree')}
                </Button>
              </div>
              {formData.owner_suggested_percentage && (
                <p className="text-xs text-muted-foreground">
                  Owner suggests: {formData.owner_suggested_percentage}% = {Number((formData.total_earnings || 0) * formData.owner_suggested_percentage / 30).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} MAD
                </p>
              )}
            </div>

            {/* Subowner Suggestion */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('clients.ownership.negotiation.subownerSuggestion', 'Subowner Suggestion')}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.subowner_suggested_percentage || ''}
                  onChange={(e) => handleSubownerSuggestion(e.target.value)}
                  placeholder="0-30"
                  className="flex-1"
                />
                <Button
                  variant={formData.subowner_agreed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSubownerAgreement(!formData.subowner_agreed)}
                >
                  {formData.subowner_agreed ? t('clients.ownership.negotiation.agreed', 'Agreed') : t('clients.ownership.negotiation.agree', 'Agree')}
                </Button>
              </div>
              {formData.subowner_suggested_percentage && (
                <p className="text-xs text-muted-foreground">
                  Subowner suggests: {formData.subowner_suggested_percentage}% = {Number((formData.total_earnings || 0) * formData.subowner_suggested_percentage / 30).toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} MAD
                </p>
              )}
            </div>

            {/* Agreement Status */}
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <div className="text-sm">
                <span className="font-medium">Owner:</span> {formData.owner_agreed ? '✅ Agreed' : '⏳ Pending'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Subowner:</span> {formData.subowner_agreed ? '✅ Agreed' : '⏳ Pending'}
              </div>
            </div>

            {/* Finalize Button */}
            {formData.owner_agreed && formData.subowner_agreed && !formData.is_finalized && (
              <Button 
                onClick={finalizePricing}
                className="w-full"
                variant="default"
              >
                {t('clients.ownership.negotiation.finalize', 'Finalize Pricing')}
              </Button>
            )}

            {formData.is_finalized && (
              <div className="p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                ✅ {t('clients.ownership.negotiation.finalized', 'Pricing finalized and saved')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 