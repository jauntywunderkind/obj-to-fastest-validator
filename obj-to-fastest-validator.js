#!/usr/bin/env node
import esMain from "es-main"
import isObject from "is-object"

const UNFREE= {}

function fast( json, free= UNFREE){
	const out= {}
	for( const key in json){
		const value= json[ key]

		// by default we assume everything seen must have the exact text
		// free items can have other values of the same type
		if( free[key]){
			let type
			if( typeof value=== "string"){
				type= "string"
			}else if( value instanceof Boolean){
				type= "boolean"
			}else if( !isNaN( value)){
				type= "number"
			}else if( Array.isArray( value)){
				// TODO: sample first element to make a items schema
				type= "array"
			}else{
				// notably object types will fall here, for now unhandle
				throw new Error(`Unknown type for key '${key}'`)
			}
		
			out[ key]= { type}
		}else if( Array.isArray( value)){
			const props = fast( value[0], free[ key])
			out[ key]= {
				type: "array",
				props
			}
		}else if( isObject( value)){
			const props= fast( value, free[ key])
			out[ key]= {
				type: "object",
				props
			}
		}else{
			out[ key]= {
				type: "equal",
				value
			}
		}
	}
	return out
}

if( esMain( import.meta)){
	import("./main.js")
		.then(m => m.default(undefined, fast))
		.then(o => console.log( JSON.stringify(o, null, "\t")))
}
