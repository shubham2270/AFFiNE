import { WorkbenchService } from '@affine/core/modules/workbench';
import {
  GlobalStateService,
  LiveData,
  useLiveData,
  useService,
} from '@toeverything/infra';
import { useEffect, useState } from 'react';

import { ToolContainer } from '../../workspace';
import { AIIcon } from './icons';
import {
  aiIslandAnimationBg,
  aiIslandBtn,
  aiIslandWrapper,
  borderAngle1,
  borderAngle2,
  borderAngle3,
} from './styles.css';

if (
  typeof window !== 'undefined' &&
  window.CSS &&
  window.CSS.registerProperty
) {
  const getName = (nameWithVar: string) => nameWithVar.slice(4, -1);
  const registerAngle = (varName: string, initialValue: number) => {
    window.CSS.registerProperty({
      name: getName(varName),
      syntax: '<angle>',
      inherits: false,
      initialValue: `${initialValue}deg`,
    });
  };
  registerAngle(borderAngle1, 0);
  registerAngle(borderAngle2, 90);
  registerAngle(borderAngle3, 180);
}

const RIGHT_SIDEBAR_AI_HAS_EVER_OPENED_KEY =
  'app:settings:rightsidebar:ai:has-ever-opened';

export const AIIsland = () => {
  // to make sure ai island is hidden first and animate in
  const [hide, setHide] = useState(true);

  const workbench = useService(WorkbenchService).workbench;
  const activeView = useLiveData(workbench.activeView$);
  const haveChatTab = useLiveData(
    activeView.sidebarTabs$.map(tabs => tabs.some(t => t.id === 'chat'))
  );
  const activeTab = useLiveData(activeView.activeSidebarTab$);
  const sidebarOpen = useLiveData(workbench.sidebarOpen$);
  const globalState = useService(GlobalStateService).globalState;
  const aiChatHasEverOpened = useLiveData(
    LiveData.from(
      globalState.watch<boolean>(RIGHT_SIDEBAR_AI_HAS_EVER_OPENED_KEY),
      false
    )
  );

  useEffect(() => {
    if (sidebarOpen && activeTab?.id === 'chat') {
      globalState.set(RIGHT_SIDEBAR_AI_HAS_EVER_OPENED_KEY, true);
    }
  }, [activeTab, globalState, sidebarOpen]);

  useEffect(() => {
    setHide((sidebarOpen && activeTab?.id === 'chat') || !haveChatTab);
  }, [activeTab, haveChatTab, sidebarOpen]);

  return (
    <ToolContainer>
      <div
        className={aiIslandWrapper}
        data-hide={hide}
        data-animation={!aiChatHasEverOpened}
      >
        <div className={aiIslandAnimationBg} />
        <button
          className={aiIslandBtn}
          data-testid="ai-island"
          onClick={() => {
            if (hide) return;
            workbench.openSidebar();
            activeView.activeSidebarTab('chat');
          }}
        >
          <AIIcon />
        </button>
      </div>
    </ToolContainer>
  );
};
