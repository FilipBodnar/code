import fabric from 'fabric'

const objects = [{
    type: 'sector',
    shape: fabric.Rect,
    target: 'Sector',
  },
  {
    type: 'rectangle',
    shape: fabric.Rect,
    target: 'Rectangle',
  },
  {
    type: 'triangle',
    shape: fabric.Triangle,
    target: 'Triangle',
  },
  {
    type: 'row',
    shape: fabric.Group,
    target: 'Row',
  },
  {
    type: 'seat',
    shape: fabric.Circle,
    target: 'Seat',
  },
  {
    type: 'circle',
    shape: fabric.Circle,
    target: 'Circle',
  },
  {
    type: 'text',
    shape: fabric.IText,
    target: 'Text',
  },
  {
    type: 'standing',
    shape: fabric.Rect,
    target: 'Standing',
  },
]

objects.map(({
  type,
  shape,
  target,
}) => {
  fabric[target] = fabric.util.createClass(shape, {
    type,
    initialize(options) {
      this.callSuper('initialize', options);
      options && this.set('properties', options.properties);
    },
    toObject() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        properties: this.properties,
      });
    },
  })
  fabric[target].fromObject = function (object, callback) {
    callback && callback(new fabric[target](object))
  }
})
