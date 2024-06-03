declare module 'react-datepicker' {
  import { ReactNode, CSSProperties } from 'react';

  interface ReactDatePickerCustomHeaderProps {
    date: Date;
    changeYear(year: number): void;
    changeMonth(month: number): void;
    decreaseMonth(): void;
    increaseMonth(): void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
  }

  interface ReactDatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null, event: React.SyntheticEvent<any> | undefined) => void;
    showMonthYearPicker?: boolean;
    dateFormat?: string;
    className?: string;
    placeholderText?: string;
    customInput?: ReactNode;
    customInputRef?: string;
    withPortal?: boolean;
    portalId?: string;
    customHeaderCount?: number;
    renderCustomHeader?: (params: ReactDatePickerCustomHeaderProps) => ReactNode;
    popperProps?: object;
    popperPlacement?: string;
    popperModifiers?: object[];
    popperContainer?: (props: { children: ReactNode[] }) => ReactNode;
    wrapperClassName?: string;
    popperClassName?: string;
    calendarClassName?: string;
    children?: ReactNode;
    inline?: boolean;
    fixedHeight?: boolean;
    locale?: string;
    minDate?: Date;
    maxDate?: Date;
    monthsShown?: number;
    openToDate?: Date;
    startOpen?: boolean;
    showDisabledMonthNavigation?: boolean;
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    dropdownMode?: 'scroll' | 'select';
    scrollableYearDropdown?: boolean;
    yearDropdownItemNumber?: number;
    forceShowMonthNavigation?: boolean;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    timeIntervals?: number;
    minTime?: Date;
    maxTime?: Date;
    excludeTimes?: Date[];
    filterTime?: (time: Date) => boolean;
    timeCaption?: string;
    timeFormat?: string;
    injectTimes?: Date[];
    useWeekdaysShort?: boolean;
    formatWeekDay?: (formattedDate: string) => ReactNode;
    formatWeekNumber?: (date: Date) => string | number;
    weekLabel?: string;
    excludeDates?: Date[];
    includeDates?: Date[];
    includeTimes?: Date[];
    excludeTimes?: Date[];
    filterDate?: (date: Date) => boolean;
    todayButton?: ReactNode;
    customTimeInput?: ReactNode;
    dateFormatCalendar?: string;
    useShortMonthInDropdown?: boolean;
    showWeekNumbers?: boolean;
    showFullMonthYearPicker?: boolean;
    showTwoColumnMonthYearPicker?: boolean;
    showFourColumnMonthYearPicker?: boolean;
    showYearArrows?: boolean;
    renderDayContents?: (dayOfMonth: number, date?: Date) => ReactNode;
    onChangeRaw?: (event: React.FocusEvent<HTMLInputElement>) => void;
    renderCustomHeader?: (params: {
      date: Date;
      changeYear: (year: number) => void;
      changeMonth: (month: number) => void;
      decreaseMonth: () => void;
      increaseMonth: () => void;
      prevMonthButtonDisabled: boolean;
      nextMonthButtonDisabled: boolean;
    }) => ReactNode;
  }

  export default function DatePicker(props: ReactDatePickerProps): JSX.Element;
}
