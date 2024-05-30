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
      icon: "build/osx.icns",
    },
    win: {
      target: [
        {
          target: "nsis",
          arch: ["x64"],
        },
      ],
      icon: "build/win.ico",
    },
    linux: {
      target: [
        {
          target: "AppImage",
        },
      ],
      icon: "build/unix.png",
    },
    nsis: {
      oneClick: true,
      perMachine: true,
      runAfterFinish: true,
      installerIcon: "build/win.ico",
      uninstallerIcon: "build/win.ico",
    },
  },
});
