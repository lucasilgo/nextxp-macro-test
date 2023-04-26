import { APP_NAME, PartData } from '@enonic/nextjs-adapter';
import React from 'react';

export const HEADING_PART_NAME = `${APP_NAME}:heading`;

export interface HeadingData {
    part: PartData;
    common: any;
}

const Heading = ({ part, common}: HeadingData) => (
    <h2>{part?.config?.heading || common?.get?.displayName}</h2>
);

export default Heading;