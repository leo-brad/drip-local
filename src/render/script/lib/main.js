import communicate from '~/render/script/lib/communicate';
import syncData from '~/render/script/lib/syncData';
import focusAndBlur from '~/render/script/lib/focusAndBlur';

export default function main() {
  syncData();
  focusAndBlur();
  communicate();
}
