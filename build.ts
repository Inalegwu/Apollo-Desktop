import { build } from "electron-builder";

build({
  config: {
    appId: "com.apollo.app",
    productName: "Apollo",
    artifactName: "${productName}-${version}_${platform}_${arch}.${ext}",
    buildDependenciesFromSource: true,
    files: ["out/**/*"],
    directories: {
      output: "release/${version}",
    },
    mac: {
      target: ["dmg"],
    },
    win: {
      target: [
        {
          target: "nsis",
          arch: ["x64"],
        },
      ],
    },
    linux: {
      target: [
        {
          target: "AppImage",
        },
      ],
    },
    nsis: {
      oneClick: true,
      perMachine: true,
      runAfterFinish: true,
    },
  },
});
