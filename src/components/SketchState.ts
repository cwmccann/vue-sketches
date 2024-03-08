export interface SliderConfig {
  type: 'slider';
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
}

export interface ColorConfig {
  type: 'color';
  label?: string;
  value: string;
}

export interface BooleanConfig {
  type: 'boolean';
  label?: string;
  value: boolean;
}

export interface StatusFieldConfig {
  type: 'status';
  label?: string;
  value: string;
}

export interface SketchState {
  props: {
    [key: string]: SliderConfig | ColorConfig | BooleanConfig | StatusFieldConfig;
  };
  playing: boolean;
  resetFlag: boolean;
}
