import {PropsWithChildren} from "react";
import {Label, SizableText, styled, XStack, YStack} from "tamagui";

export const onboardingColor = "#755EFF";

export const Title = styled(SizableText, {
  size: "$7",
  fontWeight: "bold",
});

export const Text = styled(SizableText, {});

export const AccentSection = styled(YStack, {
  w: 220,
  flex: "none",
  flexGrow: 0,
  flexShrink: 0,
  bg: onboardingColor,
  paddingHorizontal: "$4",
  paddingVertical: "$6",
  gap: "$4",
  borderRadius: "$4",
});

export const MainSection = styled(YStack, {
  f: 1,
  bg: "$background",
  p: "$6",
  gap: "$4",
});

export const Wrapper = styled(XStack, {
  jc: "stretch",
  f: 1,
});

export const SuccessIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={132}
    height={137}
    fill="none"
    {...props}
  >
    <path
      fill="#755FFD"
      fillRule="evenodd"
      d="M64.005.193C63.393.6 63.1 1.612 63.1 3.316c0 2.353.508 3.314 1.756 3.324 1.103.008 1.439-.778 1.439-3.37 0-1.987-.084-2.476-.487-2.84-.511-.463-1.308-.568-1.803-.237Zm-7.407 7.401c-.52.52-.538 1.446-.043 2.123.522.714 4.365.922 5.33.29.878-.575 1.087-1.383.566-2.178-.404-.616-.568-.653-2.931-.653-1.921 0-2.601.098-2.922.418Zm10.67.069c-.463.511-.568 1.307-.237 1.802.409.613 1.419.905 3.123.905 2.353 0 3.315-.508 3.324-1.755.008-1.104-.778-1.439-3.37-1.439-1.987 0-2.476.084-2.84.487Zm-3.541 3.654c-.641.64-.675.81-.587 2.95.1 2.44.433 3.024 1.723 3.024 1.159 0 1.432-.635 1.432-3.331 0-2.276-.052-2.531-.592-2.909-.817-.572-1.188-.523-1.976.266Zm-7.186 7.541c-6.66 4.677-9.302 11.647-6.933 18.29.36 1.01 1.043 2.913 1.517 4.227.788 2.181.85 2.583.724 4.617-.194 3.109-1.348 5.417-4.067 8.136-1.097 1.097-2.228 2.068-2.513 2.159-.369.117-1.392-.412-3.546-1.835-5.854-3.865-10.283-5.751-13.5-5.75-2.931.002-4.08 1.071-4.652 4.325-.186 1.062-1.246 5.284-2.354 9.383-7.442 27.517-19.34 72.131-19.34 72.519 0 .555.808 1.349 1.374 1.349.45 0 1.745-.344 47.605-12.645 18.227-4.889 33.82-8.996 34.651-9.126 1.77-.277 2.708-.825 3.425-2.001.74-1.213.695-4.026-.1-6.361l-.609-1.784 1.48-.171c6.15-.71 10.516-3.535 14.309-9.258 4.303-6.495 8.665-9.124 14.988-9.035 2.882.04 5.639.67 8.38 1.913 2.24 1.016 3.233 1.063 3.638.174.162-.355.215-.964.117-1.352-.208-.832-2.192-1.826-5.937-2.976-2.12-.651-2.736-.719-6.597-.725-4.142-.005-4.32.018-6.461.834-4.29 1.635-7.342 4.228-10.336 8.78-3.754 5.71-7.283 8.02-12.95 8.48l-2.24.182-.882-1.564C79.539 88.66 63.91 71.493 50.38 60.813l-2.698-2.13 1.68-1.596c3.946-3.748 5.752-7.481 5.752-11.887 0-1.996-.488-3.92-1.864-7.35-1.762-4.39-1.7-7.818.204-11.33.86-1.585 3.506-4.296 5.11-5.236.625-.366 1.362-.875 1.638-1.131.61-.567.65-1.61.083-2.177-.737-.738-1.793-.49-3.745.882Zm36.61 4.65c-2.168.892-3.173 1.577-4.734 3.227-2.66 2.814-3.465 5.778-2.792 10.296.31 2.086.333 2.97.101 4.086-.567 2.734-3.03 5.12-6.72 6.509-3.574 1.346-3.395 1.226-3.395 2.262 0 .704.166 1.04.677 1.375.645.422.784.408 2.851-.273 5.517-1.818 8.973-5.243 9.774-9.692.242-1.342.223-2.226-.094-4.392-.52-3.544-.26-5.112 1.203-7.273.879-1.297 2.65-2.533 4.727-3.3.82-.303 1.642-.747 1.825-.988.78-1.023.024-2.47-1.286-2.457-.354.003-1.316.282-2.137.62Zm-60.715 3.198c-3.597.991-5.767 4.083-5.486 7.814.198 2.633 1.745 4.928 4.083 6.059 1.507.728 4.352.855 5.903.263 1.611-.615 3.15-2.036 4.008-3.703.556-1.079.694-1.72.691-3.21-.004-2.236-.455-3.396-1.951-5.019-1.89-2.05-4.701-2.905-7.248-2.204Zm32.66 1.937c-1.678.408-2.473.81-3.544 1.793-1.589 1.459-2.165 2.783-2.172 4.992-.02 5.797 6.413 8.932 11.058 5.39 2.287-1.745 3.16-5.285 1.98-8.029-.64-1.485-2.2-3.088-3.557-3.653-.988-.411-3.011-.677-3.764-.493Zm-32.16 1.279c-2.515.897-3.563 3.472-2.406 5.912 1 2.109 4.01 2.925 5.979 1.62 1.3-.861 2.204-2.8 1.965-4.215-.238-1.408-1.693-3.062-3.017-3.43-1.206-.335-1.274-.332-2.52.113Zm31.62 2.275c-3.514 1.74-2.27 6.925 1.659 6.92 3.944-.003 4.894-5.521 1.22-7.087-1.146-.488-1.61-.46-2.88.167Zm37.849 7.31c-4.122 1.47-4.641 7.38-.844 9.606 2.238 1.311 5.386.728 6.873-1.274 1.758-2.37 1.593-4.987-.446-7.025-1.599-1.6-3.509-2.047-5.583-1.307Zm.559 3.332c-.824.649-1.025 1.568-.576 2.637.57 1.356 2.45 1.571 3.502.401.819-.91.758-1.849-.179-2.786-.909-.91-1.806-.991-2.747-.252Zm-87.53 5.955c-.48.239-.772.816-1.235 2.433-.334 1.166-.54 2.336-.455 2.6.258.814 1.271 1.315 2.058 1.016.545-.207.8-.627 1.233-2.031.622-2.014.7-3.394.214-3.77-.625-.484-1.188-.56-1.815-.248Zm11.93 3.112c-.602.366-.62 2.169-.04 3.907C29.7 62.909 38.877 75.226 50.4 86.783c10.496 10.527 20.786 18.69 28.273 22.43 3.022 1.509 4.625 2.043 6.137 2.043.996 0 1.242-.104 1.48-.627.326-.715-.164-3.003-1.117-5.218l-.558-1.299-2.04-.453c-4.264-.947-10.377-3.565-10.988-4.706-.384-.718.184-2.033.963-2.228.392-.098 1.317.212 2.694.904 2.311 1.162 6.751 2.807 6.974 2.584.198-.198-3.468-5.551-6.184-9.032-7.378-9.452-18.47-20.643-28.071-28.324l-3.026-2.42-1.316.667c-1.459.739-2.142.671-2.76-.273-.46-.702-.284-1.42.5-2.053.53-.426.476-.483-1.968-2.09-5.439-3.579-10.618-5.638-12.029-4.782Zm43.098 3.405c-.67.74-.635 5.11.046 5.727.639.578 1.453.56 2-.046.67-.74.636-5.111-.045-5.727-.639-.578-1.453-.56-2.001.046Zm-57.755 2.774c-.312.23-2.205 6.865-6.169 21.628C3.394 91.425.818 101.33.816 101.725c-.004.751.824 1.545 1.611 1.545.238 0 .643-.233.901-.518.475-.525 11.858-42.335 11.858-43.554 0-1.222-1.449-1.872-2.479-1.113Zm89.464 1.126c-3.178.874-5.576 3.194-6.897 6.671-1.014 2.672-1.926 3.852-3.573 4.626-2.072.974-4.205 1.007-8.144.127-1.424-.318-2.418 1.67-1.328 2.656.72.652 4.618 1.322 6.692 1.15 3.23-.267 6.19-1.81 7.684-4.006.412-.607 1.073-1.955 1.467-2.996.829-2.192 2.154-3.867 3.721-4.705.962-.515 1.509-.59 4.286-.59 3.162 0 3.186-.005 3.578-.701.352-.626.348-.773-.038-1.362-.784-1.195-4.634-1.645-7.448-.87Zm-76.976.677c-.074.216-.56 1.985-1.08 3.932l-.945 3.54.952 2.316c4.686 11.402 17.575 30.333 28.491 41.846 4.027 4.247 6.35 6.39 6.915 6.378.707-.014 6.9-1.721 6.9-1.901 0-.081-1.573-2.109-3.496-4.508-5.884-7.34-9.502-12.469-14.092-19.977-2.199-3.597-3.304-5.09-5.538-7.482-7.175-7.68-13.474-16.025-16.682-22.097-.771-1.461-1.343-2.283-1.425-2.047Zm93.181 2.344c-.67.74-.635 5.11.046 5.727.663.6 1.53.553 2.201-.117.5-.5.548-.807.466-2.95-.077-1.995-.178-2.454-.609-2.77-.709-.518-1.577-.473-2.104.11Zm-55.101.266c-.54.597-.564 1.372-.063 2.058.31.424.773.532 2.595.607 1.951.08 2.306.022 2.95-.485.83-.653.917-1.22.317-2.075-.377-.54-.633-.592-2.886-.592-2.057 0-2.547.082-2.913.487Zm10.621.105c-.6.855-.513 1.422.318 2.075.644.507.998.565 2.95.485 2.374-.097 2.972-.439 2.972-1.697 0-1.125-.771-1.455-3.4-1.455-2.205 0-2.463.054-2.84.592Zm-3.283 3.283c-.544.38-.592.627-.592 3.067 0 2.582.018 2.66.677 2.96a1.78 1.78 0 0 0 1.397.055c.712-.25.722-.29.8-2.909.07-2.447.032-2.692-.496-3.122-.705-.573-1.028-.582-1.786-.051Zm40.55 3.638c-.6.855-.513 1.421.317 2.075.645.507.999.565 2.95.485 2.375-.097 2.973-.439 2.973-1.698 0-1.124-.772-1.454-3.4-1.454-2.205 0-2.464.054-2.84.592Zm10.83-.26c-.649.812-.636 1.516.04 2.192.594.595.889.67 2.612.666 2.403-.004 3.244-.38 3.353-1.499.137-1.397-.43-1.691-3.261-1.691-1.663 0-2.565.11-2.744.333Zm-3.466 3.543c-.539.377-.592.633-.592 2.887 0 2.73.311 3.353 1.67 3.353 1.116 0 1.525-.876 1.525-3.265 0-1.856-.071-2.154-.654-2.736-.761-.762-1.137-.808-1.949-.24Zm-96.775.057c-.226.387-3.637 13.38-3.637 13.852 0 .582 3.429 6.5 6.48 11.182 5.019 7.704 11.56 16.136 17.668 22.774l1.438 1.563 5.773-1.534c3.176-.844 5.826-1.579 5.889-1.634.063-.055-1.393-1.625-3.237-3.489-10.383-10.502-21.582-25.97-28.32-39.12-1.068-2.083-1.992-3.7-2.054-3.594Zm-5.106 19.008c-.082.215-.918 3.257-1.857 6.76L13.082 105l2.522 3.787c2.875 4.316 7.188 10.161 10.341 14.013a859.503 859.503 0 0 1 2.48 3.039c.329.413.896.285 11.303-2.538.348-.094-.184-.846-2.316-3.276-6.707-7.642-13.55-16.951-18.473-25.132-2.216-3.683-2.099-3.528-2.293-3.022Zm39.396 5.01c2.653 4.371 13.487 18.077 14.3 18.092.378.007 6.62-1.583 7.925-2.019.232-.078-.608-.661-2.047-1.421-5.469-2.888-9.656-5.952-19.476-14.252-.519-.439-.835-.619-.702-.4Zm53.038 1.337c-1.333.723-2.522 2.413-2.745 3.902-.599 3.996 3.595 7.335 7.28 5.795 2.234-.933 3.366-2.814 3.207-5.324-.12-1.887-.796-3.104-2.294-4.13-1.301-.892-4.028-1.014-5.448-.243Zm.889 3.357c-1.627 2.069.937 4.633 3.006 3.006.895-.704.983-2.361.169-3.175-.814-.814-2.471-.726-3.175.169Zm-98.05 7.993c-.283.476-6.086 22.501-5.961 22.627.115.115 17.499-4.431 18.838-4.927.436-.161.297-.427-1.135-2.175-2.466-3.011-6.793-8.808-9.135-12.241-2.45-3.592-2.435-3.572-2.607-3.284Z"
      clipRule="evenodd"
    />
  </svg>
);

export function Input({
  id,
  label,
  children,
}: PropsWithChildren<{label: string; id: string}>) {
  return (
    <YStack borderWidth={1} borderColor="$color7" borderRadius="$3">
      <Label
        position="absolute"
        htmlFor={id}
        size="$1"
        bg="$background"
        color="$color8"
        marginLeft="$2"
        style={{transform: "translateY(-50%)"}}
        paddingHorizontal="$2"
      >
        {label}
      </Label>
      {children}
    </YStack>
  );
}
