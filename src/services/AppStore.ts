import { OpenAPISpec } from '../types';
import { loadAndBundleSpec } from '../utils/loadAndBundleSpec';
import { MenuStore } from './MenuStore';
import { SpecStore } from './SpecStore';
import { RedocNormalizedOptions, RedocRawOptions } from './RedocNormalizedOptions';
import { ScrollService } from './ScrollService';
import { SearchStore } from './SearchStore';

interface StoreData {
  menu: {
    activeItemIdx: number;
  };
  spec: {
    url: string;
    data: any;
  };
  options: RedocRawOptions;
}

export async function createStore(
  spec: object,
  specUrl: string | undefined,
  options: RedocRawOptions = {},
) {
  const resolvedSpec = await loadAndBundleSpec(spec || specUrl);
  return new AppStore(resolvedSpec, specUrl, options);
}

export class AppStore {
  /**
   * deserialize store
   * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
   */
  // TODO:
  static fromJS(state: StoreData): AppStore {
    const inst = new AppStore(state.spec.data, state.spec.url, state.options);
    inst.menu.activeItemIdx = state.menu.activeItemIdx || 0;
    inst.menu.activate(inst.menu.flatItems[inst.menu.activeItemIdx]);
    return inst;
  }

  menu: MenuStore;
  spec: SpecStore;
  rawOptions: RedocRawOptions;
  options: RedocNormalizedOptions;
  search: SearchStore;

  private scroll: ScrollService;

  constructor(spec: OpenAPISpec, specUrl?: string, options: RedocRawOptions = {}) {
    this.rawOptions = options;
    this.options = new RedocNormalizedOptions(options);
    this.scroll = new ScrollService(this.options);
    this.spec = new SpecStore(spec, specUrl, this.options);
    this.menu = new MenuStore(this.spec, this.scroll);

    this.search = new SearchStore(this.spec);
  }

  dispose() {
    this.scroll.dispose();
    this.menu.dispose();
  }

  /**
   * serializes store
   * **SUPER HACKY AND NOT OPTIMAL IMPLEMENTATION**
   */
  // TODO:
  toJS(): StoreData {
    return {
      menu: {
        activeItemIdx: this.menu.activeItemIdx,
      },
      spec: {
        url: this.spec.parser.specUrl,
        data: this.spec.parser.spec,
      },
      options: this.rawOptions,
    };
  }
}
