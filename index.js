
const add_attr = (obj, key, val) => {
    if(!val) {
        if(!obj.prop_attrs) {
            obj.prop_attrs = []
        }
        obj.prop_attrs.push(key)
    } else {
        if(!obj.val_attrs) {
            obj.val_attrs = {}
        }
        if(obj.val_attrs[key]) {
           var current = obj.val_attrs[key]
           if(Array.isArray(current)) {
             current.push(val)
           } else {
             obj.val_attrs[key] = [current, val]
           }
        } else {
            obj.val_attrs[key] = val
        }
    }
}

const add_val = (obj, key, val) => {
    if(obj[key]) {
       var current = obj[key]
       if(Array.isArray(current)) {
         current.push(val)
       } else {
         obj[key] = [current, val]
       }
    } else {
        obj[key] = val
    }
}

const parse = (s) => {
    var session = {
        media: [],
    }
    
    var lines = s.split("\r\n")
    var target = session
    lines.forEach(line => {
        // we cannot use line.split() as the line might contain more than one "="
        const equalIdx = line.indexOf("=")
        var type = line.slice(0,equalIdx)
        var val = line.slice(equalIdx+1)
        if(type == "m") {
            var med = val.split(" ")
            target = {
                desc: {
                    type: med[0],
                    port: med[1],
                    protocol: med[2],
                    formats: med.slice(3),
                },
            }
            session.media.push(target)
        } else if(type == 'a') {
            const colonIdx = val.indexOf(":")
            var k = val.slice(0,colonIdx)
            var v = val.slice(colonIdx+1)

            var tokens = val.split(":", 2)
            var k = tokens[0]
            var v = tokens[1] 
            add_attr(target, k, v)
        } else if(type == 'c') {
            var c = val.split(" ")
            target.conn = {
                network_type: c[0],
                address_type: c[1],
                address: c[2],
            }
        } else {
            add_val(target, type, val)
        }
    })

    return session
}

module.exports = parse
