import * as path from 'path';
import { types, util } from 'vortex-api';
import { UnrealGameHelper } from 'vortex-ext-common';

const GAME_ID: string = 'sifu';
const EPIC_APP_ID: string = 'd36336f190094951873ed6138ac208d8';
const STEAM_APP_ID: string = '2138710';

function findGame() {
  return util.GameStoreHelper.findByAppId([EPIC_APP_ID, STEAM_APP_ID])
    .then(gameEntry => gameEntry.gamePath);
}

function init(context: types.IExtensionContext) {
  const unreal = new UnrealGameHelper(GAME_ID);
  const relModPath = path.join('Sifu', 'Content', 'Paks', '~mods');

  context.registerGame({
    name: 'Sifu',
    mergeMods: true,
    logo: 'gameart.jpg',
    supportedTools: [],
    executable: () => 'Sifu.exe',
    requiredFiles: [
      'Sifu.exe'
    ],
    id: GAME_ID,
    queryPath: findGame,
    queryModPath: () => relModPath,
    setup: (discovery) => unreal.prepareforModding(discovery, relModPath),
    environment: {
      SteamAPPId: STEAM_APP_ID,
    },
    details: {
      steamAppId: +STEAM_APP_ID,
    },
    compatible: {
    },
  });

  context.registerInstaller('sifu-installer', 50,
    unreal.testSupportedContent, unreal.installContent);

  return true;
}

export default init;
