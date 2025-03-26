
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinance } from '@/context/FinanceContext';
import { Badge, BadgeCheck, BadgePercent, DollarSign } from 'lucide-react';

const Badges: React.FC = () => {
  const { badges } = useFinance();

  // Function to get the icon based on the badge icon name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'badge':
        return <Badge className="h-8 w-8" />;
      case 'badge-check':
        return <BadgeCheck className="h-8 w-8" />;
      case 'badge-percent':
        return <BadgePercent className="h-8 w-8" />;
      case 'dollar-sign':
        return <DollarSign className="h-8 w-8" />;
      default:
        return <Badge className="h-8 w-8" />;
    }
  };

  // Separate earned and unearned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">Your Achievements</h1>
        
        <div className="grid grid-cols-1 gap-8 animate-fade-in">
          {/* Earned Badges Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Earned Badges</CardTitle>
              <CardDescription>Achievements you've unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedBadges.map(badge => (
                    <div 
                      key={badge.id}
                      className="glass-card p-6 rounded-xl flex flex-col items-center text-center card-transition"
                    >
                      <div className="bg-primary/10 p-4 rounded-full text-primary mb-4">
                        {getIcon(badge.icon)}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                      <p className="text-muted-foreground mb-4">{badge.description}</p>
                      {badge.earnedDate && (
                        <div className="bg-primary/5 text-xs text-primary rounded-full px-3 py-1 mt-auto">
                          Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't earned any badges yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Keep tracking your finances to unlock achievements
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Unearned Badges Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl">Badges to Unlock</CardTitle>
              <CardDescription>Upcoming achievements to earn</CardDescription>
            </CardHeader>
            <CardContent>
              {unearnedBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unearnedBadges.map(badge => (
                    <div 
                      key={badge.id}
                      className="bg-secondary/80 border border-border p-6 rounded-xl flex flex-col items-center text-center card-transition"
                    >
                      <div className="bg-muted p-4 rounded-full text-muted-foreground mb-4">
                        {getIcon(badge.icon)}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                      <p className="text-muted-foreground mb-4">{badge.description}</p>
                      {badge.progress !== undefined && (
                        <div className="w-full mt-auto space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You've earned all available badges!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check back later for new challenges
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Badges;
