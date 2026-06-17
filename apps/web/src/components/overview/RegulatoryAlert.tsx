import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RegulatoryAlert() {
  return (
    <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-lg">
      <div className="flex items-center space-x-2 mb-1">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider">REGULATORY INSIGHT</span>
      </div>
      <p className="text-[10px] text-amber-900 leading-relaxed font-semibold">
        Sourcing manifests originating from <strong>Vietnam</strong> have increased by 24% this month, suggesting tariff-avoidance detours.
      </p>
    </div>
  );
}
