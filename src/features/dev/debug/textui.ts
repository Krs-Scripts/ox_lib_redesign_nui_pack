import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugTextUI = () => {
  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        text: '[E] - Access locker inventory',
        position: 'right-center',
        // icon: 'door-open',
      },
    },
  ]);
};
