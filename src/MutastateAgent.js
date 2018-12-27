import BaseAgent from './BaseAgent';

export default class MutastateAgent extends BaseAgent {
  constructor(mutastate, onChange) {
    super(mutastate, onChange);
    this.mutastate = mutastate;
    this.data = {};
    this.onChange = onChange;
  }
}
