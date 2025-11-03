export type ChangeData = {
    key: string[];
    type: 'set' | 'delete';
    value?: any;
};
type ChangeCallback = (data: ChangeData) => void;
/**
 * Helper to wrap changes with a callback
 */
export default function changeWrapper(target: any, onChange: ChangeCallback): any;
export {};
