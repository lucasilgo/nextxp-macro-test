import { ContentApiBaseBody, fetchGuillotine, fetchFromApi } from '@enonic/nextjs-adapter';
import { PartProps } from '@enonic/nextjs-adapter/views/BasePart';
import React from 'react';

const TestGeneral = (props: PartProps) => {
    console.log('Test part...')
    console.log(props)
    const { apiUrl } = props.meta;
    console.log(apiUrl)
    const handleTest = async () => {
        const body: ContentApiBaseBody = {
            query: `
                query($path:ID!){
                    guillotine {
                        get(key:$path) {
                            displayName
                            type
                        }
                    }
                }
            `,
            variables: {
                path: '/hmdb',
            },
        };
        
        const headers = {
            'custom-header': 'header-value',
        };

        console.log(1)

        const result = await fetchGuillotine(apiUrl, body);
        console.log(2)
        console.log('Result: ', result)

        // return JSON.stringify(result, null, 2)
    }

    handleTest();

    return (
        <>
            <h2>Test Part</h2>
        </>
    )
}

export default TestGeneral;