import { useState, useCallback } from 'react';

export function useComplianceAudit() {
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = useCallback(async (params: { hsCode: string; origin: string }) => {
    setIsAuditing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let result = {
      basicTariff: '2.5% MFN rate',
      surtax: '0.0% Surtax Excluded',
      sanctions: 'CLEARED',
      overallRisk: 'LOW LANDED RISK STABILITY'
    };

    if (params.origin === 'CHN') {
      result = {
        basicTariff: '3.4% Base duty',
        surtax: '+25.0% Surtax Active',
        sanctions: 'CLEARED (No verified threats)',
        overallRisk: 'HIGH EXPOSURE TARIFF RISK'
      };
    }

    setAuditResult(result);
    setIsAuditing(false);
  }, []);

  return {
    auditResult,
    isAuditing,
    runAudit
  };
}