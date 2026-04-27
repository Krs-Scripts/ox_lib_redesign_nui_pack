import { Button, Group, Modal, Stack, createStyles, Box, Text } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';
import { SiDialogflow } from "react-icons/si";

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles(() => ({
  modalRoot: {
    '.mantine-Modal-modal': {
      backgroundColor: 'rgba(20, 20, 20, 0.98)', 
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: 10,
      color: 'white',
      padding: '25px !important',
      overflow: 'hidden',
    },
    '.mantine-Modal-header': {
      marginBottom: 20,
      backgroundColor: 'transparent',
    },
    '.mantine-Modal-title': {
      width: '100%',
    },
  },

  headerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15, 
    width: '100%',
  },

  titleStack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0,
  },

  contextLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    lineHeight: 1,
    letterSpacing: '1px',
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 900,
    textTransform: 'uppercase',
    lineHeight: 0.9,
    color: 'white',
    margin: 0,
  },

  inputContainer: {
    '.mantine-Input-input, .mantine-TextInput-input, .mantine-Select-input, .mantine-Textarea-input, .mantine-NumberInput-input, .mantine-DatePicker-input, .mantine-DateRangePicker-input, .mantine-ColorInput-input': {
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: 'none',
      color: 'white',
      borderRadius: 10,
      '&:focus': {
        borderColor: '#0496ff00',
        backgroundColor: 'rgba(255,255,255,0.05)',
      },
    },

    // --- POPUP CALENDAR & COLOR PICKER ---
    '.mantine-DatePicker-dropdown, .mantine-DateRangePicker-dropdown, .mantine-ColorInput-dropdown': {
      backgroundColor: 'rgb(20, 20, 20) !important',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px !important',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      padding: '10px !important',
    },

    // --- (DATES) ---
    '.mantine-DatePicker-calendarHeaderControl': {
       color: 'white !important',
       borderRadius: '8px',
       '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05) !important' }
    },
    '.mantine-DatePicker-calendarHeaderLevel': {
       color: 'white !important',
       fontWeight: 700,
       textTransform: 'uppercase',
       fontSize: '12px',
       '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05) !important' }
    },
    '.mantine-DatePicker-weekday': {
      color: '#666 !important',
      fontWeight: 700,
      fontSize: '11px',
    },
    '.mantine-DatePicker-day': {
      color: 'white !important',
      borderRadius: '8px !important',
      fontSize: '12px',
      
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05) !important' }, 
      '&[data-selected]': {
        backgroundColor: '#0496ff !important',
        color: 'white !important',
      },
      '&[data-outside]': { color: 'rgba(255, 255, 255, 0.1) !important' },
      '&[data-weekend]': { color: '#ff4d4d !important' },
    },

    // --- COLOR PICKER INTERNALS ---
    '.mantine-ColorPicker-swatch': {
        borderRadius: '6px !important',
    },
    '.mantine-ColorPicker-slider, .mantine-ColorPicker-thumb': {
        borderRadius: '10px !important',
    },

    '.mantine-Slider-track': {
      backgroundColor: 'rgba(255, 255, 255, 0.05) !important', 
      '&::before': {
        backgroundColor: 'rgba(255, 255, 255, 0.05) !important',
      }
    },

    '.mantine-NumberInput-control': {
      border: 'none',
      color: 'white',
      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    },

    '.mantine-Select-dropdown, .mantine-MultiSelect-dropdown': {
      backgroundColor: 'rgba(15, 15, 15, 0.98)',
      border: 'none',
      borderRadius: 10,
    },
    '.mantine-Select-item, .mantine-MultiSelect-item': {
      color: 'white',
      borderRadius: 10,
      '&[data-hovered]': { backgroundColor: '#0496ff' },
      '&[data-selected]': { backgroundColor: '#0496ff !important' },
    },

    '.mantine-Input-icon': { color: '#0496ff !important' },
    '.mantine-Checkbox-input': {
      backgroundColor: 'rgba(0,0,0,0.6) !important',
      border: '1px solid rgba(255,255,255,0.1) !important',
      '&:checked': { backgroundColor: '#0496ff !important' },
    },
    '.mantine-Slider-bar': { backgroundColor: '#0496ff' },
    '.mantine-Slider-thumb': { borderColor: '#0496ff', backgroundColor: 'white' },

    '.mantine-Input-label': {
      color: 'white',
      fontWeight: 700,
      fontSize: 13,
      marginBottom: 4,
    },
  },

  confirmBtn: {
    backgroundColor: '#0496ff',
    color: 'white !important',
    height: 42,
    fontSize: 13,
    fontWeight: 800,
    borderRadius: 10,
    border: 'none',
    '&:hover': { backgroundColor: '#0385e6' },
  },

  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white !important',
    height: 42,
    fontSize: 13,
    fontWeight: 700,
    borderRadius: 10,
    border: 'none',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
  },
}));

const HexIcon = ({ icon }: { icon: React.ReactNode }) => {
  const brandBlue = "#0496ff";
  const hexPath = "M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z";
  return (
    <Box style={{ position: 'relative', width: '50px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <path d={hexPath} fill="rgba(255, 255, 255, 0.08)" strokeWidth="6" strokeLinejoin="round" />
      </svg>
      <Box style={{ position: 'relative', width: '76%', height: '76%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <path d={hexPath} fill={brandBlue} stroke={brandBlue} strokeWidth="4" strokeLinejoin="round" />
        </svg>
        <Box style={{ zIndex: 10, display: 'flex', color: '#f3f3f3', position: 'relative' }}>{icon}</Box>
      </Box>
    </Box>
  );
};

const InputDialog: React.FC = () => {
  const { classes } = useStyles();
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();
  const form = useForm<FormValues>({});
  const fieldForm = useFieldArray({ control: form.control, name: 'test' });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
        value: row.type !== 'checkbox' ? (row.type === 'date' || row.type === 'date-range' || row.type === 'time' ? (row.default === true ? new Date().getTime() : (Array.isArray(row.default) ? row.default.map((date: any) => new Date(date).getTime()) : (row.default ? new Date(row.default).getTime() : null))) : (row.default ?? null)) : (row.checked ?? false),
      });
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) => !option.label ? { ...option, label: option.value } : option) as Array<OptionValue>;
      }
    });
  });

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];
      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <Modal
      opened={visible}
      onClose={() => handleClose()}
      centered
      closeOnEscape={fields.options?.allowCancel !== false}
      closeOnClickOutside={false}
      size="xs"
      className={classes.modalRoot}
      withCloseButton={false}
      title={
        <Box className={classes.headerWrapper}>
          <HexIcon icon={<SiDialogflow size={22} />} />
          <Box className={classes.titleStack}>
            <Text className={classes.contextLabel}>Dialog</Text>
            <h2 className={classes.mainTitle}>{fields.heading || 'INPUT'}</h2>
          </Box>
        </Box>
      }
    >
      <form onSubmit={onSubmit}>
        <Stack spacing="xl" className={classes.inputContainer}>
          <Box>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <Box key={item.id} mb={index !== fieldForm.fields.length - 1 ? 20 : 0}>
                  {row.type === 'input' && <InputField register={form.register(`test.${index}.value`)} row={row} index={index} />}
                  {row.type === 'checkbox' && <CheckboxField register={form.register(`test.${index}.value`)} row={row} index={index} />}
                  {(row.type === 'select' || row.type === 'multi-select') && <SelectField row={row} index={index} control={form.control} />}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {(row.type === 'date' || row.type === 'date-range') && <DateField control={form.control} row={row} index={index} />}
                  {row.type === 'textarea' && <TextareaField register={form.register(`test.${index}.value`)} row={row} index={index} />}
                </Box>
              );
            })}
          </Box>
          <Group position="center" grow spacing="md">
            <Button uppercase variant="subtle" onClick={() => handleClose()} className={classes.cancelBtn} disabled={fields.options?.allowCancel === false}>
              {locale.ui.cancel}
            </Button>
            <Button uppercase type="submit" className={classes.confirmBtn}>
              {locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default InputDialog;