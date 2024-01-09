import { versionUrl } from "../const";

const version =
  document.querySelector<HTMLMetaElement>("meta[name='version']")?.content ??
  "0.0.0";

export const updateAvailable = async () => {
  try {
    const response = await fetch(versionUrl);
    if (!response.ok) return false;
    const latestVersion = await response.text();
    console.log(latestVersion);
    console.log(version);
    if (!latestVersion) return false;

    return compareVersions(latestVersion, version) > 0;
  } catch (e) {
    console.log(e);
    return false;
  }
};

function compareVersions(version1: string, version2: string) {
  const [major1, minor1, patch1] = version1.split(".").map(Number);
  const [major2, minor2, patch2] = version2.split(".").map(Number);

  if (major1 > major2) return 1;
  if (major1 < major2) return -1;

  if (minor1 > minor2) return 1;
  if (minor1 < minor2) return -1;

  if (patch1 > patch2) return 1;
  if (patch1 < patch2) return -1;

  return 0;
}
