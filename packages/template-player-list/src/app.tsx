import { getConfig, getData, ready } from "@fgate/template-sdk";
import type {
  InferTemplateConfig,
  InferTemplateData,
  OnlinePlayer,
} from "@fgate/template-sdk";
import { useEffect, useState } from "react";

import type { configSchema, dataSources } from "../vite.config";
import { PlayerAvatar } from "./avatar";

type TemplateData = InferTemplateData<typeof dataSources>;
type TemplateConfig = InferTemplateConfig<typeof configSchema>;

/** 6:00-18:00 视为白天使用浅色主题，其余时间使用深色主题 */
const isDaytime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
};

const playerName = (player: OnlinePlayer): string =>
  player.displayName ?? player.name;

export default function App() {
  const { onlinePlayers } = getData<TemplateData>();
  const { title } = getConfig<TemplateConfig>();
  const [pendingAvatars, setPendingAvatars] = useState(onlinePlayers.length);

  useEffect(() => {
    if (pendingAvatars <= 0) {
      ready();
    }
  }, [pendingAvatars]);

  const handleAvatarSettled = (): void => {
    setPendingAvatars((count) => count - 1);
  };

  const dark = !isDaytime();
  const theme = dark
    ? {
        avatarRing: "ring-white/10",
        badge: "bg-amber-400/10 text-amber-300",
        canvas: "bg-stone-950",
        card: "bg-stone-900 text-stone-100 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/5",
        divider: "border-white/10",
        subtext: "text-stone-400",
      }
    : {
        avatarRing: "ring-stone-900/10",
        badge: "bg-amber-500/10 text-amber-700",
        canvas: "bg-stone-200",
        card: "bg-[#fbf8f2] text-stone-800 shadow-[0_16px_40px_-16px_rgba(120,100,70,0.45)] ring-1 ring-stone-900/5",
        divider: "border-stone-900/10",
        subtext: "text-stone-500",
      };

  return (
    <div className={`p-8 ${theme.canvas}`}>
      <div
        className={`paper-texture flex w-80 flex-col gap-4 rounded-2xl p-5 font-sans ${theme.card}`}
      >
        <div
          className={`flex items-center justify-between border-b pb-3 ${theme.divider}`}
        >
          <h1 className="font-serif text-lg font-semibold tracking-tight">
            {title}
          </h1>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${theme.badge}`}
          >
            {onlinePlayers.length} 人在线
          </span>
        </div>
        {onlinePlayers.length === 0 ? (
          <p className={`text-sm ${theme.subtext}`}>当前没有在线玩家</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {onlinePlayers.map((player) => (
              <div
                className="flex flex-col items-center gap-1.5"
                key={player.uuid}
              >
                <PlayerAvatar
                  name={playerName(player)}
                  onSettled={handleAvatarSettled}
                  ringClassName={theme.avatarRing}
                  uuid={player.uuid}
                />
                <span className="w-full truncate text-center text-[11px] font-medium">
                  {playerName(player)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
