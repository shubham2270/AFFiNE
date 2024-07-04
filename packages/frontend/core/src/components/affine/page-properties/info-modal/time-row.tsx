import { i18nTime, useI18n } from '@affine/i18n';
import { DateTimeIcon, HistoryIcon } from '@blocksuite/icons/rc';
import { useLiveData, useService, WorkspaceService } from '@toeverything/infra';
import { useDebouncedValue } from 'foxact/use-debounced-value';
import { type ReactNode, useContext, useMemo } from 'react';

import { managerContext } from '../common';
import * as styles from './time-row.css';

const RowComponent = ({
  name,
  icon,
  time,
}: {
  name: string;
  icon: ReactNode;
  time?: string | null;
}) => {
  return (
    <div className={styles.rowCell}>
      <div className={styles.rowNameContainer}>
        <div className={styles.icon}>{icon}</div>
        <span className={styles.rowName}>{name}</span>
      </div>
      <div className={styles.time}>{time ? time : 'unknown'}</div>
    </div>
  );
};

export const TimeRow = ({ docId }: { docId: string }) => {
  const t = useI18n();
  const manager = useContext(managerContext);
  const workspaceService = useService(WorkspaceService);
  const { syncing, retrying, serverClock } = useLiveData(
    workspaceService.workspace.engine.doc.docState$(docId)
  );
  const timestampElement = useMemo(() => {
    const localizedCreateTime = manager.createDate
      ? i18nTime(manager.createDate)
      : null;

    return (
      <>
        <RowComponent
          icon={<DateTimeIcon />}
          name={t['Created']()}
          time={
            manager.createDate
              ? i18nTime(manager.createDate, {
                  relative: {
                    max: [1, 'day'],
                    accuracy: 'minute',
                  },
                  absolute: {
                    accuracy: 'day',
                  },
                })
              : localizedCreateTime
          }
        />
        {serverClock ? (
          <RowComponent
            icon={<HistoryIcon />}
            name={t[!syncing && !retrying ? 'Updated' : 'com.affine.syncing']()}
            time={
              !syncing && !retrying
                ? i18nTime(serverClock, {
                    relative: {
                      max: [1, 'day'],
                      accuracy: 'minute',
                    },
                    absolute: {
                      accuracy: 'day',
                    },
                  })
                : null
            }
          />
        ) : manager.updatedDate ? (
          <RowComponent
            icon={<HistoryIcon />}
            name={t['Updated']()}
            time={i18nTime(manager.updatedDate)}
          />
        ) : null}
      </>
    );
  }, [
    manager.createDate,
    manager.updatedDate,
    retrying,
    serverClock,
    syncing,
    t,
  ]);

  const dTimestampElement = useDebouncedValue(timestampElement, 500);

  return <div className={styles.container}>{dTimestampElement}</div>;
};
