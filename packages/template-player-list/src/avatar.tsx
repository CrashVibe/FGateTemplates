import { useState } from "react";

const AVATAR_SIZE = 40;
/** mc-heads.net 上的 Steve 默认皮肤账号，作为头像加载失败时的兜底 */
const FALLBACK_AVATAR_NAME = "MHF_Steve";

interface PlayerAvatarProps {
  uuid: string;
  name: string;
  /** 头像加载完成（成功或失败）时回调一次，供外层等待所有头像就绪后再 ready() */
  onSettled: () => void;
  /** 外层主题决定的描边颜色，如 "ring-stone-900/10" */
  ringClassName: string;
}

/**
 * 玩家头像：通过 mc-heads.net 渲染皮肤头像，加载失败时回退为史蒂夫的默认头像。
 * mc-heads.net 需在 manifest 的 networkPermissions 中声明，否则渲染沙箱会拦截请求。
 */
export const PlayerAvatar = ({
  uuid,
  name,
  onSettled,
  ringClassName,
}: PlayerAvatarProps) => {
  const [useFallback, setUseFallback] = useState(false);

  const avatarName = useFallback ? FALLBACK_AVATAR_NAME : uuid;

  return (
    <img
      alt={name}
      className={`size-10 shrink-0 rounded-xl object-cover ring-1 ${ringClassName}`}
      onError={() => {
        if (useFallback) {
          onSettled();
        } else {
          setUseFallback(true);
        }
      }}
      onLoad={onSettled}
      src={`https://mc-heads.net/avatar/${avatarName}/${AVATAR_SIZE}`}
    />
  );
};
