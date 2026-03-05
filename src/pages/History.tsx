import { useNavigate } from "react-router-dom";
import { getCheckIns, groupByDate, type CheckInEntry } from "@/lib/checkInStorage";
import { ChevronLeft } from "lucide-react";

const intensityLabel = (v: number) => {
  if (v <= 3) return "Mild";
  if (v <= 6) return "Moderate";
  if (v <= 8) return "Strong";
  return "Very strong";
};

const choiceLabel: Record<string, string> = {
  didnt: "Didn't act",
  acted: "Acted",
  deciding: "Still deciding",
};

const EntryCard = ({ entry }: { entry: CheckInEntry }) => {
  const time = new Date(entry.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="bg-card rounded-xl p-4 border border-border animate-soft-fade">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{time}</span>
        {entry.craving ? (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-amber/20 text-foreground">
            Craving
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-sage/20 text-foreground">
            No craving
          </span>
        )}
      </div>

      {entry.craving && (
        <div className="flex flex-col gap-1.5 mt-2">
          {entry.intensity && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(entry.intensity / 10) * 100}%`,
                    backgroundColor: "hsl(var(--slider-fill))",
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {entry.intensity}/10 · {intensityLabel(entry.intensity)}
              </span>
            </div>
          )}
          {entry.trigger && (
            <p className="text-sm text-muted-foreground">
              Trigger: <span className="text-foreground">{entry.trigger}</span>
            </p>
          )}
          {entry.choice && (
            <p className="text-sm text-muted-foreground">
              Outcome: <span className="text-foreground">{choiceLabel[entry.choice] || entry.choice}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();
  const entries = getCheckIns();
  const grouped = groupByDate(entries);
  const dates = Object.keys(grouped);

  return (
    <div className="min-h-dvh bg-app-gradient flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-safe-top py-4">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-heading font-semibold text-xl text-foreground">History</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        {dates.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] animate-soft-fade">
            <p className="text-muted-foreground text-center text-lg font-heading">No check-ins yet.</p>
            <p className="text-muted-foreground text-center text-sm mt-1">
              Complete a craving check to see your history.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {dates.map((date) => (
              <div key={date}>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
                  {date}
                </p>
                <div className="flex flex-col gap-3">
                  {grouped[date].map((entry) => (
                    <EntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
