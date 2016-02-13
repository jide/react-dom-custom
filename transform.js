module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const REQUIRE_CALL = {
    type: 'CallExpression',
    callee: {
      name: 'require',
    }
  };

  const rewire = {
    'ReactMount': './ReactMount',
    'ReactDefaultInjection': './ReactDefaultInjection',
    'instantiateReactComponent': './instantiateReactComponent',
    'ReactChildReconciler': './ReactChildReconciler',
    'ReactMultiChild': './ReactMultiChild',
    'ReactDefaultPerf': 'react/lib/ReactDefaultPerf',
    'ReactCompositeComponent': 'react/lib/ReactCompositeComponent',
    'ReactComponentEnvironment': 'react/lib/ReactComponentEnvironment',
    'ReactMultiChildUpdateTypes': 'react/lib/ReactMultiChildUpdateTypes',
    'ReactBrowserEventEmitter': 'react/lib/ReactBrowserEventEmitter',
    'ReactCurrentOwner': 'react/lib/ReactCurrentOwner',
    'ReactDOMFeatureFlags': 'react/lib/ReactDOMFeatureFlags',
    'ReactElement': 'react/lib/ReactElement',
    'ReactEmptyComponentRegistry': 'react/lib/ReactEmptyComponentRegistry',
    'ReactInstanceHandles': 'react/lib/ReactInstanceHandles',
    'ReactInstanceMap': 'react/lib/ReactInstanceMap',
    'ReactMarkupChecksum': 'react/lib/ReactMarkupChecksum',
    'ReactPerf': 'react/lib/ReactPerf',
    'ReactReconciler': 'react/lib/ReactReconciler',
    'ReactUpdateQueue': 'react/lib/ReactUpdateQueue',
    'ReactUpdates': 'react/lib/ReactUpdates',
    'ReactEmptyComponent': 'react/lib/ReactEmptyComponent',
    'ReactNativeComponent': 'react/lib/ReactNativeComponent',
    'ReactDOMTextComponent': 'react/lib/ReactDOMTextComponent',
    'ReactVersion': 'react/lib/ReactVersion',
    'BeforeInputEventPlugin': 'react/lib/BeforeInputEventPlugin',
    'ChangeEventPlugin': 'react/lib/ChangeEventPlugin',
    'ClientReactRootIndex': 'react/lib/ClientReactRootIndex',
    'DefaultEventPluginOrder': 'react/lib/DefaultEventPluginOrder',
    'EnterLeaveEventPlugin': 'react/lib/EnterLeaveEventPlugin',
    'HTMLDOMPropertyConfig': 'react/lib/HTMLDOMPropertyConfig',
    'ReactBrowserComponentMixin': 'react/lib/ReactBrowserComponentMixin',
    'ReactComponentBrowserEnvironment': 'react/lib/ReactComponentBrowserEnvironment',
    'ReactDefaultBatchingStrategy': 'react/lib/ReactDefaultBatchingStrategy',
    'ReactDOMComponent': 'react/lib/ReactDOMComponent',
    'ReactEventListener': 'react/lib/ReactEventListener',
    'ReactInjection': 'react/lib/ReactInjection',
    'ReactReconcileTransaction': 'react/lib/ReactReconcileTransaction',
    'SelectEventPlugin': 'react/lib/SelectEventPlugin',
    'ServerReactRootIndex': 'react/lib/ServerReactRootIndex',
    'SimpleEventPlugin': 'react/lib/SimpleEventPlugin',
    'SVGDOMPropertyConfig': 'react/lib/SVGDOMPropertyConfig',
    'findDOMNode': 'react/lib/findDOMNode',
    'renderSubtreeIntoContainer': 'react/lib/renderSubtreeIntoContainer',
    'flattenChildren': 'react/lib/flattenChildren',
    'traverseAllChildren': 'react/lib/traverseAllChildren',
    'DOMProperty': 'react/lib/DOMProperty',
    'setInnerHTML': 'react/lib/setInnerHTML',
    'shouldUpdateReactComponent': 'react/lib/shouldUpdateReactComponent',
    'validateDOMNesting': 'react/lib/validateDOMNesting',
    'Object.assign': 'react/lib/Object.assign',
    'warning': 'fbjs/lib/warning',
    'invariant': 'fbjs/lib/invariant',
    'containsNode': 'fbjs/lib/containsNode',
    'emptyObject': 'fbjs/lib/emptyObject',
    'ExecutionEnvironment': 'fbjs/lib/ExecutionEnvironment'
  };

  function isRequire(path, moduleName) {
    return (
      path.value.type === 'CallExpression' &&
      path.value.callee.type === 'Identifier' &&
      path.value.callee.name === 'require' &&
      path.value.arguments.length === 1 &&
      path.value.arguments[0].type === 'Literal' &&
      path.parent.value.type === 'VariableDeclarator'
    );
  }

  const createRequire = (id, requireName) =>
    j.variableDeclarator(
      id,
      j.callExpression(
        j.identifier('require'),
        [j.literal(requireName)]
      )
    );

  root
    .find(j.CallExpression)
    .filter(p => isRequire(p))
    .filter(p => {
      return Object.keys(rewire).indexOf(p.value.arguments[0].value) !== -1
    })
    .forEach(p => {
      const name = p.parent.value.id.name;
      const path = p.value.arguments[0].value;

      j(p.parent).replaceWith(createRequire(j.identifier(name), rewire[path]));
    });

  return root.toSource({quote: 'single'});
};
