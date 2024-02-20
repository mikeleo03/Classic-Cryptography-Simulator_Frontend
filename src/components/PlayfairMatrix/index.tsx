import React from 'react';

interface MatrixProps {
  stringMatrix: string;
  rows: number;
  cols: number;
}

const PlayfairMatrix: React.FC<MatrixProps> = ({ stringMatrix, rows, cols }) => {
    // Split the string into substring
    const substrings = stringMatrix.match(new RegExp(`.{1,${cols}}`, 'g')) || [];
    
    // Pad the last substring with empty strings if needed
    const paddedSubstrings = [...substrings, ...Array(rows - substrings.length).fill('').map(() => '')];

    return (
        <div className="grid grid-row-5 gap-1">
            {paddedSubstrings.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.split('').map((element, colIndex) => (
                        <div key={colIndex} className="border border-gray-500 w-10 h-10 p-2 justify-center items-center flex rounded-xl mx-1">
                            {element}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PlayfairMatrix;