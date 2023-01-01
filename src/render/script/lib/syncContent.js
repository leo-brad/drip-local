import global from '~/render/script/obj/global';

export default function syncContent() {
  const { content, emitter, } = global;
  emitter.on('content/update', (data) => {
    const { instance, field, string, } = data;
    const { contents, index, } = content;
    if (field === 'stderr') {
      new Notification(
        'drip',
        { body:  'instance ' + instance +  ' happen a wrong.', },
      );
    }
    if (index[instance] === undefined) {
      index[instance] = contents.length;
    }
    const i = index[instance];
    if (!Array.isArray(contents[i])) {
      contents[i] = [];
    }
    contents[i].push({ field, string, });
    global.content = {
      index,
      contents,
    };
  });
  emitter.on('content/reset', () => {
    global.content = {
      index: {},
      contents: [],
    };
  });
}
