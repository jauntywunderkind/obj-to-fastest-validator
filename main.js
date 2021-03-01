#!/usr/bin/env node
import esMain from "es-main"
import { promises as fsPromises} from "fs"
const readFile= fsPromises.readFile

export async function args(){
	const process= await import("process")
	return process.argv.slice( 2)
}

export async function main( a= args(), m){
	if( a){
		a= await a
	}

	if( !m){
		// for now
		m= import( "./fast.js")
	}
	m= await m
	m= m.default|| m

	a= a.map( name=> readFile( name, "utf8"))
	a= await Promise.all( a)
	for( const i in a){
		a[ i]= JSON.parse( a[ i])
	}

	// TODO: only reading off first file
	return m( a[0])
}
export default main

if( esMain( import.meta)){
	main().then(o => console.log( JSON.stringify(o, null, "\t")))
}
