const nonAtomsTuples = ['replace', ':replace']
const nonAtomsObjects = ['match_actor', ':match_actor']
const objects = ['digest', 'pleroma_fe', 'masto_fe', 'poll_limits', 'styling']
const objectParents = ['mascots']

// REFACTOR
export const parseTuples = (tuples, key) => {
  return tuples.reduce((accum, item) => {
    if (key === 'rate_limit') {
      accum[item.tuple[0]] = item.tuple[1]
    } else if ((item.tuple[0] === ':sslopts' && item.tuple[1].length === 0) || // should be removed
      (item.tuple[0] === ':tlsopts' && item.tuple[1].length === 0)) {
      accum[item.tuple[0]] = {}
    } else if (Array.isArray(item.tuple[1]) &&
      (typeof item.tuple[1][0] === 'object' && !Array.isArray(item.tuple[1][0])) && item.tuple[1][0]['tuple']) {
      accum[item.tuple[0]] = parseTuples(item.tuple[1])
    } else if (Array.isArray(item.tuple[1])) {
      nonAtomsTuples.includes(item.tuple[0])
        ? accum[item.tuple[0]] = parseNonAtomTuples(item.tuple[1])
        : accum[item.tuple[0]] = item.tuple[1]
    } else if (item.tuple[0] === ':ip') {
      accum[item.tuple[0]] = item.tuple[1].tuple.join('.')
    } else if (item.tuple[1] && typeof item.tuple[1] === 'object' && 'tuple' in item.tuple[1]) {
      accum[item.tuple[0]] = { [item.tuple[1].tuple[0]]: item.tuple[1].tuple[1] }
    } else if (item.tuple[1] && typeof item.tuple[1] === 'object') {
      nonAtomsObjects.includes(item.tuple[0])
        ? accum[item.tuple[0]] = parseNonAtomObject(item.tuple[1])
        : accum[item.tuple[0]] = parseObject(item.tuple[1])
    } else {
      accum[item.tuple[0]] = item.tuple[1]
    }
    return accum
  }, {})
}

const parseNonAtomTuples = (tuples) => {
  return tuples.reduce((acc, item) => {
    acc[item.tuple[0]] = item.tuple[1]
    return acc
  }, {})
}

const parseNonAtomObject = (object) => {
  return Object.keys(object).reduce((acc, item) => {
    acc[item] = object[item]
    return acc
  }, {})
}

const parseObject = (object) => {
  return Object.keys(object).reduce((acc, item) => {
    acc[item] = object[item]
    return acc
  }, {})
}

export const valueHasTuples = (key, value) => {
  const valueIsArrayOfNonObjects = Array.isArray(value) && value.length > 0 && typeof value[0] !== 'object'
  return key === ':meta' ||
    key === ':types' ||
    key === ':compiled_template_engines' ||
    key === ':compiled_format_encoders' ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    valueIsArrayOfNonObjects
}

export const wrapUpdatedSettings = (group, settings) => {
  return Object.keys(settings).map((key) => {
    const value = wrapValues(settings[key])
    return { group, key, value }
  })
}

const wrapValues = settings => {
  return Object.keys(settings).map(setting => {
    const [type, value] = settings[setting]
    if (type === 'keyword' || type.includes('keyword')) {
      return { 'tuple': [setting, wrapValues(value)] }
    } else if (type === 'atom') {
      return { 'tuple': [setting, `:${value}`] }
    } else if (setting === ':ip') {
      const ip = value.split('.').map(s => parseInt(s, 10))
      return { 'tuple': [setting, { 'tuple': ip }] }
    } else {
      return { 'tuple': [setting, value] }
    }
  })
}

const wrapNestedTuples = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    const data = setting[settingName]
    if (data === null || data === '') {
      return acc
    } else if (settingName === 'ip') {
      const ip = data.split('.').map(s => parseInt(s, 10))
      return [...acc, { 'tuple': [`:${settingName}`, { 'tuple': ip }] }]
    } else if (Array.isArray(data) || typeof data !== 'object') {
      return [...acc, { 'tuple': [`:${settingName}`, data] }]
    } else if (nonAtomsObjects.includes(settingName)) {
      return [...acc, { 'tuple': [`:${settingName}`, wrapNonAtomsObjects(data)] }]
    } else if (objectParents.includes(settingName)) {
      return [...acc, { 'tuple': [`:${settingName}`, wrapNestedObjects(data)] }]
    } else if (objects.includes(settingName)) {
      return [...acc, { 'tuple': [`:${settingName}`, wrapObjects(data)] }]
    } else if (nonAtomsTuples.includes(settingName)) {
      return [...acc, { 'tuple': [`:${settingName}`, wrapNonAtomsTuples(data)] }]
    } else {
      return [...acc, { 'tuple': [`:${settingName}`, wrapNestedTuples(data)] }]
    }
  }, [])
}

const wrapNonAtomsTuples = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    return [...acc, { 'tuple': [`${settingName}`, setting[settingName]] }]
  }, [])
}

const wrapNestedObjects = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    return [...acc, { 'tuple': [`:${settingName}`, wrapObjects(setting[settingName])] }]
  }, [])
}

const wrapNonAtomsObjects = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    return { ...acc, [`${settingName}`]: setting[settingName] }
  }, {})
}

const wrapObjects = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    return { ...acc, [`:${settingName}`]: setting[settingName] }
  }, {})
}
