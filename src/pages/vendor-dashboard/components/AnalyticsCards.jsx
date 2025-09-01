import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsCards = ({ analyticsData = {} }) => {
  const mockAnalytics = {
    todayCalls: { value: 12, change: +15, trend: 'up' },
    weeklyVolume: { value: 89, change: -8, trend: 'down' },
    acceptanceRate: { value: 85, change: +5, trend: 'up' },
    avgRating: { value: 4.7, change: +0.2, trend: 'up' },
    totalEarnings: { value: 2450, change: +12, trend: 'up' },
    responseTime: { value: 45, change: -10, trend: 'up' }
  };

  const analytics = { ...mockAnalytics, ...analyticsData };

  const cards = [
    {
      id: 'calls',
      title: 'Today\'s Calls',
      value: analytics?.todayCalls?.value,
      unit: '',
      change: analytics?.todayCalls?.change,
      trend: analytics?.todayCalls?.trend,
      icon: 'Phone',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 'volume',
      title: 'Weekly Volume',
      value: analytics?.weeklyVolume?.value,
      unit: 'calls',
      change: analytics?.weeklyVolume?.change,
      trend: analytics?.weeklyVolume?.trend,
      icon: 'BarChart3',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      id: 'acceptance',
      title: 'Acceptance Rate',
      value: analytics?.acceptanceRate?.value,
      unit: '%',
      change: analytics?.acceptanceRate?.change,
      trend: analytics?.acceptanceRate?.trend,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      id: 'rating',
      title: 'Avg Rating',
      value: analytics?.avgRating?.value,
      unit: '/5',
      change: analytics?.avgRating?.change,
      trend: analytics?.avgRating?.trend,
      icon: 'Star',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : 'text-error';
  };

  const formatValue = (value, unit) => {
    if (unit === '/5') {
      return value?.toFixed(1);
    }
    return value?.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards?.map((card) => (
        <div key={card?.id} className="bg-card rounded-lg border border-border p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-lg ${card?.bgColor} flex items-center justify-center`}>
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(card?.trend)}`}>
              <Icon name={getTrendIcon(card?.trend)} size={16} />
              <span className="text-sm font-medium">
                {card?.change > 0 ? '+' : ''}{card?.change}{card?.unit === '%' ? '%' : ''}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-2xl font-bold text-foreground">
                {formatValue(card?.value, card?.unit)}
              </span>
              {card?.unit && (
                <span className="text-sm text-muted-foreground">{card?.unit}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{card?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;