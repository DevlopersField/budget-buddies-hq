
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinance } from '@/context/FinanceContext';
import { Badge, BadgeCheck, BadgePercent, DollarSign } from 'lucide-react';

const Achievements: React.FC = () => {
  const { badges } = useFinance();

  // Function to get the icon based on the badge icon name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'badge':
        return <Badge className="h-6 w-6" />;
      case 'badge-check':
        return <BadgeCheck className="h-6 w-6" />;
      case 'badge-percent':
        return <BadgePercent className="h-6 w-6" />;
      case 'dollar-sign':
        return <DollarSign className="h-6 w-6" />;
      default:
        return <Badge className="h-6 w-6" />;
    }
  };

  // Separate earned and unearned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <Card className="w-full glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Achievements</CardTitle>
        <CardDescription>Track your financial milestones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {earnedBadges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Earned Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedBadges.map(badge => (
                <div 
                  key={badge.id}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    {getIcon(badge.icon)}
                  </div>
                  <div>
                    <h4 className="font-medium">{badge.name}</h4>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    {badge.earnedDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {unearnedBadges.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Available Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unearnedBadges.map(badge => (
                <div 
                  key={badge.id}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/80 border border-border"
                >
                  <div className="bg-muted p-3 rounded-full text-muted-foreground">
                    {getIcon(badge.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{badge.name}</h4>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    {badge.progress !== undefined && (
                      <div className="mt-2 space-y-1">
                        <Progress value={badge.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground text-right">
                          {badge.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {badges.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No achievements available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Achievements;
