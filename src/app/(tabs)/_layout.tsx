import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function Tabs() {
  const tint = DynamicColorIOS({ dark: "white", light: "black" });

  return (
    <NativeTabs tintColor={tint}>
      <NativeTabs.Trigger name="login/index">
        <Icon sf="person" />
        <Label>Login</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="events/index">
        <Icon sf="calendar" />
        <Label>Eventos</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="social/index">
        <Icon sf="person.2.fill" />
        <Label>Social</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="activities/index">
        <Icon sf="figure.walk" />
        <Label>Atividades</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="ranking/index">
        <Icon sf="chart.bar.fill" />
        <Label>Ranking</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile/index">
        <Icon sf="person.fill" />
        <Label>Perfil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
