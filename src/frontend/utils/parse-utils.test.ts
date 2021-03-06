import * as test from 'tape';
import {ParseUtils} from './parse-utils';

test('utils/parse-utils: copyParent', t => {
  t.plan(1);
  const mockData = {
    name: 'mockData'
  };

  const result = {
    name: 'mockData',
    children: undefined
  };

  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.copyParent(mockData);
  t.deepEqual(result, output, 'result should be equal to output');
  t.end();
});

test('utils/parse-utils: flatten list data', t => {
  t.plan(1);
  const mockData = [{
    id: '0',
    name: 'mockData',
    children: [{
      id: '0.1',
      name: 'one'
    }, {
      id: '0.2',
      name: 'two',
      children: [{
        id: '0.2.1',
        name: 'three'
      }, {
        id: '0.2.2',
        name: 'four'
      }]
    }]
  }];

  const result = [{
    children: undefined,
    id: '0',
    name: 'mockData'
  }, {
    id: '0.1',
    name: 'one'
    }, {
      children: undefined,
      id: '0.2',
      name: 'two'
  }, {
    id: '0.2.1',
    name: 'three'
    }, {
      id: '0.2.2',
      name: 'four'
  }];

  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.flatten(mockData);
  t.deepEqual(result, output, 'result should be equal to output');
  t.end();
});

test('utils/parse-utils: getParentHierarchy', t => {
  t.plan(1);
  const mockData = [{
    id: '0',
    name: 'mockData',
    children: [{
      id: '0.1',
      name: 'one'
    }, {
      id: '0.2',
      name: 'two',
      children: [{
        id: '0.2.1',
        name: 'three'
      }, {
        id: '0.2.2',
        name: 'four'
      }]
    }]
  }];

  const node = {
    id: '0.2.2',
    name: 'four'
  };

  const result = [{
    children: undefined,
    id: '0',
    name: 'mockData'
  }, {
    children: undefined,
    id: '0.2',
    name: 'two'
    }];

  const parseUtils: ParseUtils = new ParseUtils();
  const flattened = parseUtils.flatten(mockData);
  const output = parseUtils.getParentHierarchy(flattened, node);
  t.deepEqual(result, output, 'result should be equal to output');
  t.end();
});

test('utils/parse-utils: getParentNodeIds', t => {
  t.plan(1);
  const nodeId = '0.1.22.333.444';
  const parseUtils: ParseUtils = new ParseUtils();
  const output = parseUtils.getParentNodeIds(nodeId);
  const result = ['0', '0.1', '0.1.22', '0.1.22.333'];
  t.deepEqual(result, output, 'result should be equal to output');
  t.end();
});

test('utils/parse-utils: getDependencyLink', t => {
  t.plan(1);
  const mockData = [{
    id: '0',
    name: 'mockData',
    injectors: ['service1'],
    children: [{
      id: '0.1',
      name: 'one',
      injectors: ['service2']
    }, {
      id: '0.2',
      name: 'two',
      injectors: ['service3'],
      children: [{
        id: '0.2.1',
        name: 'three'
      }, {
        id: '0.2.2',
        name: 'four',
        injectors: ['service1']
      }]
    }]
  }];

  const nodeId = '0.2.2';
  const dependency = 'service1';

  const parseUtils: ParseUtils = new ParseUtils();
  const flattened = parseUtils.flatten(mockData);
  const output = parseUtils.getDependencyLink(flattened, nodeId, dependency);
  const result = {
    children: undefined,
    id: '0',
    injectors: [ 'service1' ],
    name: 'mockData'
  };

  t.deepEqual(result, output, 'result should be equal to output');
  t.end();
});
