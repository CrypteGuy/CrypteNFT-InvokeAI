import { Divider, Flex } from '@chakra-ui/react';
import { createSelector } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/store/storeHooks';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import IAIButton from 'common/components/IAIButton';
import IAICollapse from 'common/components/IAICollapse';
import ControlNet from 'features/controlNet/components/ControlNet';
import ParamControlNetFeatureToggle from 'features/controlNet/components/parameters/ParamControlNetFeatureToggle';
import {
  controlNetAdded,
  controlNetSelector,
} from 'features/controlNet/store/controlNetSlice';
import { getValidControlNets } from 'features/controlNet/util/getValidControlNets';
import { useFeatureStatus } from 'features/system/hooks/useFeatureStatus';
import { map } from 'lodash-es';
import { Fragment, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

const selector = createSelector(
  controlNetSelector,
  (controlNet) => {
    const { controlNets, isEnabled } = controlNet;

    const validControlNets = getValidControlNets(controlNets);

    const activeLabel =
      isEnabled && validControlNets.length > 0
        ? `${validControlNets.length} Active`
        : undefined;

    return { controlNetsArray: map(controlNets), activeLabel };
  },
  defaultSelectorOptions
);

const ParamControlNetCollapse = () => {
  const { t } = useTranslation();
  const { controlNetsArray, activeLabel } = useAppSelector(selector);
  const isControlNetDisabled = useFeatureStatus('controlNet').isFeatureDisabled;
  const dispatch = useAppDispatch();

  const handleClickedAddControlNet = useCallback(() => {
    dispatch(controlNetAdded({ controlNetId: uuidv4() }));
  }, [dispatch]);

  if (isControlNetDisabled) {
    return null;
  }

  return (
    <IAICollapse label="ControlNet" activeLabel={activeLabel}>
      <Flex sx={{ flexDir: 'column', gap: 3 }}>
        <ParamControlNetFeatureToggle />
        {controlNetsArray.map((c, i) => (
          <Fragment key={c.controlNetId}>
            {i > 0 && <Divider />}
            <ControlNet controlNet={c} />
          </Fragment>
        ))}
        <IAIButton flexGrow={1} onClick={handleClickedAddControlNet}>
          Add ControlNet
        </IAIButton>
      </Flex>
    </IAICollapse>
  );
};

export default memo(ParamControlNetCollapse);
