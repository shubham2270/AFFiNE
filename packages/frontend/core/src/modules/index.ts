import { configureQuotaModule } from '@affine/core/modules/quota';
import { configureInfraModules, type Framework } from '@toeverything/infra';

import { configureCloudModule } from './cloud';
import { configureQuickSearchModule } from './cmdk';
import { configureCollectionModule } from './collection';
import { configureFindInPageModule } from './find-in-page';
import { configureNavigationModule } from './navigation';
import { configurePeekViewModule } from './peek-view';
import { configurePermissionsModule } from './permissions';
import { configureWorkspacePropertiesModule } from './properties';
import { configureShareDocsModule } from './share-doc';
import { configureStorageImpls } from './storage';
import { configureTagModule } from './tag';
import { configureTelemetryModule } from './telemetry';
import { configureWorkbenchModule } from './workbench';

export function configureCommonModules(framework: Framework) {
  configureInfraModules(framework);
  configureCollectionModule(framework);
  configureNavigationModule(framework);
  configureTagModule(framework);
  configureWorkbenchModule(framework);
  configureWorkspacePropertiesModule(framework);
  configureCloudModule(framework);
  configureQuotaModule(framework);
  configurePermissionsModule(framework);
  configureShareDocsModule(framework);
  configureTelemetryModule(framework);
  configureFindInPageModule(framework);
  configurePeekViewModule(framework);
  configureQuickSearchModule(framework);
}

export function configureImpls(framework: Framework) {
  configureStorageImpls(framework);
}
