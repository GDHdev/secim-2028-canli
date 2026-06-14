import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { HOURLY_TURNOUT, NATIONAL_TURNOUT_2028, NATIONAL_TURNOUT_2023 } from "@/lib/mock-data";
import { Clock3, TrendingUp } from "lucide-react";

/**
 * SAATLİK KATILIM — Türkiye'de "katılım düştü mü?" en çok izlenen soru.
 * 2028 vs 2023 yan yana, saat saat.
 */
export function HourlyTurnout() {
  const delta = +(NATIONAL_TURNOUT_2028 - NATIONAL_TURNOUT_2023).toFixed(1);
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-500/10 text-success-600">
            <Clock3 size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Saatlik katılım — 2028 vs 2023</h3>
            <p className="text-xs text-gray-500">
              Sandık başında geçen her saat birikimli katılım oranı (%).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">2028</p>
            <p className="font-display text-xl font-semibold tabular-nums text-gray-900">
              %{NATIONAL_TURNOUT_2028}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              delta >= 0 ? "bg-success-500/10 text-success-600" : "bg-error-500/10 text-error-600"
            }`}
          >
            <TrendingUp size={11} />
            {delta > 0 ? "+" : ""}{delta} pt
          </span>
        </div>
      </div>

      <div className="h-[260px] w-full px-2 pt-3 pb-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={HOURLY_TURNOUT} margin={{ top: 6, right: 16, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="t2028" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand-600)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--color-brand-600)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="t2023" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-gray-400)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-gray-400)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="var(--color-gray-200)" />
            <XAxis dataKey="hour" stroke="var(--color-gray-500)" fontSize={11} />
            <YAxis stroke="var(--color-gray-500)" fontSize={11} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid var(--color-gray-200)",
                borderRadius: 10,
                fontSize: 12,
                boxShadow: "var(--shadow-md)",
              }}
              formatter={(v: number, n: string) => [`%${v}`, n === "t2028" ? "2028" : "2023"]}
            />
            <Legend
              verticalAlign="top"
              height={20}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
              formatter={(v: string) => (v === "t2028" ? "2028" : "2023")}
            />
            <Area type="monotone" dataKey="t2023" stroke="var(--color-gray-400)" strokeWidth={2} fill="url(#t2023)" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="t2028" stroke="var(--color-brand-600)" strokeWidth={2.5} fill="url(#t2028)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
