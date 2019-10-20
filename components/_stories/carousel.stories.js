import React from 'react';
import { storiesOf } from '@storybook/react';
import Carousel from '../Carousel/Carousel';

const images = [
  'https://loremflickr.com/640/480?lock=1',
  'https://loremflickr.com/640/480?lock=2',
  'https://loremflickr.com/640/480?lock=3',
  'https://loremflickr.com/640/480?lock=4',
  'https://loremflickr.com/640/480?lock=5',
  'https://loremflickr.com/640/480?lock=6',
  'https://loremflickr.com/640/480?lock=7',
  'https://loremflickr.com/640/480?lock=8',
  'https://loremflickr.com/640/480?lock=9',
];

storiesOf('Carousel', module).add('Simple one', () => <Carousel width={500} height={200} images={images}></Carousel>);
