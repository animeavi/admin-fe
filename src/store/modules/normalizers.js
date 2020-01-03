const nonAtomsTuples = ['replace', ':replace']
const nonAtomsObjects = ['match_actor', ':match_actor']
const objects = ['digest', 'pleroma_fe', 'masto_fe', 'poll_limits', 'styling']
const objectParents = ['mascots']

const getCurrentValue = (object, keys) => {
  if (keys.length === 0) {
    return object
  }
  const [currentKey, ...restKeys] = keys
  return getCurrentValue(object[currentKey], restKeys)
}

const getValueWithoutKey = (key, [type, value]) => {
  if (type === 'atom' && value.length > 1) {
    return `:${value}`
  } else if (key === ':backends') {
    const index = value.findIndex(el => el === ':ex_syslogger')
    const updatedArray = value.slice()
    if (index !== -1) {
      updatedArray[index] = { 'tuple': ['ExSyslogger', ':ex_syslogger'] }
    }
    return updatedArray
  } else if (key === ':types') {
    return Object.keys(value).reduce((acc, key) => { return { ...acc, [key]: value[key][1] } }, {})
  }
  return value
}

export const parseNonTuples = (key, value) => {
  if (key === ':backends') {
    const index = value.findIndex(el => typeof el === 'object' && el.tuple.includes(':ex_syslogger'))
    const updated = value.map((el, i) => i === index ? ':ex_syslogger' : el)
    return { value: updated }
  }
  return { value }
}
// REFACTOR
export const parseTuples = (tuples, key) => {
  return tuples.reduce((accum, item) => {
    if (key === ':rate_limit') {
      accum[item.tuple[0]] = Array.isArray(item.tuple[1])
        ? item.tuple[1].map(el => el.tuple)
        : item.tuple[1].tuple
    } else if (item.tuple[0] === ':mascots') {
      accum[item.tuple[0]] = item.tuple[1].reduce((acc, mascot) => {
        return [...acc, { [mascot.tuple[0]]: { ...mascot.tuple[1], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
      }, [])
    } else if (item.tuple[0] === ':groups' || item.tuple[0] === ':replace' || item.tuple[0] === ':retries') {
      accum[item.tuple[0]] = item.tuple[1].reduce((acc, group) => {
        return [...acc, { [group.tuple[0]]: { value: group.tuple[1], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
      }, [])
    } else if (item.tuple[0] === ':match_actor') {
      accum[item.tuple[0]] = Object.keys(item.tuple[1]).reduce((acc, regex) => {
        return [...acc, { [regex]: { value: item.tuple[1][regex], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
      }, [])
    } else if (item.tuple[0] === ':icons') {
      accum[item.tuple[0]] = item.tuple[1].map(icon => {
        return Object.keys(icon).map(name => {
          return { key: name, value: icon[name], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }
        })
      }, [])
    } else if (item.tuple[0] === ':prune') {
      accum[item.tuple[0]] = item.tuple[1] === ':disabled' ? [item.tuple[1]] : item.tuple[1].tuple
    } else if (item.tuple[0] === ':proxy_url') {
      accum[item.tuple[0]] = parseProxyUrl(item.tuple[1])
    } else if ((item.tuple[0] === ':sslopts' && item.tuple[1].length === 0) || // should be removed
      (item.tuple[0] === ':tlsopts' && item.tuple[1].length === 0)) {
      accum[item.tuple[0]] = {}
    } else if (Array.isArray(item.tuple[1]) &&
      (typeof item.tuple[1][0] === 'object' && !Array.isArray(item.tuple[1][0])) && item.tuple[1][0]['tuple']) {
      accum[item.tuple[0]] = parseTuples(item.tuple[1], item.tuple[0])
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

const parseObject = object => {
  return Object.keys(object).reduce((acc, item) => {
    acc[item] = object[item]
    return acc
  }, {})
}

const parseProxyUrl = value => {
  if (value && !Array.isArray(value) &&
    typeof value === 'object' &&
    value.tuple.length === 3 &&
    value.tuple[0] === ':socks5') {
    const [, host, port] = value.tuple
    return { socks5: true, host, port }
  } else if (typeof value === 'string') {
    const [host, port] = value.split(':')
    return { socks5: false, host, port }
  }
  return { socks5: false, host: null, port: null }
}

export const partialUpdate = (group, key) => {
  if ((group === ':pleroma' && key === 'Oban') ||
    (group === ':auto_linker' && key === ':opts')) {
    return false
  }
  return true
}

export const processNested = (valueForState, valueForUpdatedSettings, group, parentKey, parents, settings, updatedSettings) => {
  const [{ key, type }, ...otherParents] = parents
  const path = [group, parentKey, ...parents.reverse().map(parent => parent.key).slice(0, -1)]

  const updatedValueForState = valueExists(settings, path)
    ? { ...getCurrentValue(settings[group][parentKey], parents.map(el => el.key).slice(0, -1)),
      ...{ [key]: valueForState }}
    : { [key]: valueForState }
  const updatedValueForUpdatedSettings = valueExists(updatedSettings, path)
    ? { ...getCurrentValue(updatedSettings[group][parentKey], parents.map(el => el.key).slice(0, -1))[1],
      ...{ [key]: [type, valueForUpdatedSettings] }}
    : { [key]: [type, valueForUpdatedSettings] }

    // if (group === ':mime' && key === ':types') {
  //   updatedValueForState = { ...settings[group][key].value, ...updatedValueForState }
  //   updatedValueForUpdatedSettings = {
  //     ...Object.keys(settings[group][key].value)
  //       .reduce((acc, el) => {
  //         return { ...acc, [el]: [['list', 'string'], settings[group][key].value[el]] }
  //       }, {}),
  //     ...updatedValueForUpdatedSettings
  //   }
  // }
  return otherParents.length === 1
    ? { valueForState: updatedValueForState, valueForUpdatedSettings: updatedValueForUpdatedSettings, setting: otherParents[0] }
    : processNested(updatedValueForState, updatedValueForUpdatedSettings, group, parentKey, otherParents, settings, updatedSettings)
}

const valueExists = (value, path) => {
  if (path.length === 0) {
    return true
  }
  const [element, ...rest] = path
  return value[element] ? valueExists(value[element], rest) : false
}

export const valueHasTuples = (key, value) => {
  const valueIsArrayOfNonObjects = Array.isArray(value) && value.length > 0 && value.every(el => typeof el !== 'object')
  return key === ':meta' ||
    key === ':types' ||
    key === ':backends' ||
    key === ':compiled_template_engines' ||
    key === ':compiled_format_encoders' ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    valueIsArrayOfNonObjects
}

export const wrapUpdatedSettings = (group, settings, currentState) => {
  return Object.keys(settings).map((key) => {
    return settings[key]._value
      ? { group, key, value: getValueWithoutKey(key, settings[key]._value) }
      : { group, key, value: wrapValues(settings[key], currentState[group][key]) }
  })
}

const wrapValues = (settings, currentState) => {
  return Object.keys(settings).map(setting => {
    const [type, value] = Array.isArray(settings[setting]) ? settings[setting] : ['', settings[setting]]
    if (type === 'keyword' || type.includes('keyword') || setting === ':replace') {
      return { 'tuple': [setting, wrapValues(value, currentState)] }
    } else if (type === 'atom' && value.length > 0) {
      return { 'tuple': [setting, `:${value}`] }
    } else if (type.includes('tuple') && (type.includes('string') || type.includes('atom'))) {
      return { 'tuple': [setting, { 'tuple': value }] }
    } else if (type.includes('tuple') && type.includes('list')) {
      return { 'tuple': [setting, value] }
    } else if (type === 'map') {
      const mapValue = Object.keys(value).reduce((acc, key) => {
        acc[key] = setting === ':match_actor' ? value[key] : value[key][1]
        return acc
      }, {})
      const mapCurrentState = setting === ':match_actor'
        ? currentState[setting].reduce((acc, element) => {
          return { ...acc, ...{ [Object.keys(element)[0]]: Object.values(element)[0].value }}
        }, {})
        : currentState[setting]
      return { 'tuple': [setting, { ...mapCurrentState, ...mapValue }] }
    } else if (setting === ':ip') {
      const ip = value.split('.').map(s => parseInt(s, 10))
      return { 'tuple': [setting, { 'tuple': ip }] }
    } else if (setting === ':ssl_options') {
      return { 'tuple': [setting, wrapValues(value, currentState)] }
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
