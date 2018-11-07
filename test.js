let matrix2 = [
    [ 4, 2, 3, 1, 7 ],
    [ 1, 1, 2, 3, 6 ],
    [ 2, 8, 9, 4, 5 ],
    [ 3, 7, 6, 5, 1 ],
    [ 8, 7, 0, 9, 2 ]
]
let matrix = [
    [ 1, 2, 3, 4],
    [ 1, 2, 3, 4],
    [ 1, 2, 3, 4],
    [ 1, 2, 3, 4]
]

let returnMatrix = JSON.parse(JSON.stringify(matrix));
let l = returnMatrix.length -1;

let endMatrix = [
    [ 1, 4, 2, 3, 1 ],
    [ 2, 8, 1, 2, 7 ],
    [ 3, 7, 9, 3, 6 ],
    [ 8, 6, 5, 4, 5 ],
    [ 7, 0, 9, 2, 1 ]
]


matrix.forEach( (row, rowIndex) =>{
    row.forEach((e, columnIndex)=>{
        if( rowIndex == columnIndex ){
            if(rowIndex < l/2){
                returnMatrix[rowIndex][ columnIndex + 1] =  e
            }  
            else {
                returnMatrix[rowIndex][ columnIndex - 1] =  e  
            }   
        }
        else if( rowIndex == l-columnIndex ){
            if(columnIndex < l/2){
                returnMatrix[ rowIndex - 1 ][ columnIndex ] =  e
            }  
            else {
                returnMatrix[rowIndex + 1][ columnIndex ] =  e  
            }  
        }
        else if( columnIndex < rowIndex && columnIndex <= l-rowIndex ){
            returnMatrix[ rowIndex -1 ][ columnIndex ] =  e
        }
        else if( l - columnIndex < rowIndex  && rowIndex >= columnIndex ){
            returnMatrix[ rowIndex  ][ columnIndex -1 ] =  e
        }
        else if( rowIndex < l/2 && columnIndex != l ){
            returnMatrix[ rowIndex  ][ columnIndex + 1  ] =  e
        }
        else{
            returnMatrix[ rowIndex + 1  ][ columnIndex  ] =  e
        }
    })
})

console.log("origial matrix:")
matrix.forEach( row => console.log(row))
console.log("end result:")
returnMatrix.forEach( row => console.log(row))
console.log("expected matrix:")
endMatrix.forEach( row => console.log(row))
