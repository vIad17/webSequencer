import * as d3 from 'd3';
import { clamp } from "../functions/math";
import { pitchNotes } from "../const/notes";
import { Note } from '../interfaces';

export const generatePreview = (
  notesArray: Note[],
  width: number = 344,
  height: number = 228
): string => {
  if (!notesArray || notesArray.length === 0) {
    return '';
  }

  const minVelocityIndex = notesArray.reduce(
    (minIndex, current, currentIndex, array) => {
      return current.note < array[minIndex].note ? currentIndex : minIndex;
    },
    0
  );

  const maxVelocityIndex = notesArray.reduce(
    (minIndex, current, currentIndex, array) => {
      return current.note > array[minIndex].note ? currentIndex : minIndex;
    },
    0
  );

  const minNotePositionIndex = notesArray.reduce(
    (minIndex, current, currentIndex, array) => {
      return current.attackTime < array[minIndex].attackTime ? currentIndex : minIndex;
    },
    0
  );

  const maxNotePositionIndex = notesArray.reduce(
    (minIndex, current, currentIndex, array) => {
      return current.attackTime + current.duration > array[minIndex].attackTime + array[minIndex].duration ? currentIndex : minIndex;
    },
    0
  );

  const minVelocityNote = notesArray[minVelocityIndex];
  const maxVelocityNote = notesArray[maxVelocityIndex];
  const defaultDeltaVelocity = maxVelocityNote && minVelocityNote
    ? maxVelocityNote.note - minVelocityNote.note
    : 0;
  const deltaVelocity = Math.max(defaultDeltaVelocity, 12) + 1;

  const minDeltaPositionNote = notesArray[minNotePositionIndex];
  const maxDeltaPositionNote = notesArray[maxNotePositionIndex];
  const defaultDeltaPosition = maxDeltaPositionNote && minDeltaPositionNote
    ? maxDeltaPositionNote.attackTime + maxDeltaPositionNote.duration - minDeltaPositionNote.attackTime
    : 0;
  const deltaPosition = clamp(defaultDeltaPosition, 32, 256);

  const elemWidth = width / deltaPosition;
  const elemHeight = height / deltaVelocity;
  const columnCount = deltaPosition;
  const rowsCount = deltaVelocity;

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  svg
    .selectAll('rect.bg-row')
    .data(Array.from({ length: rowsCount + 1 }, (_, i) => i))
    .enter()
    .append('rect')
    .attr('class', 'bg-row')
    .attr('x', 0)
    .attr('y', i => i * elemHeight)
    .attr('width', width)
    .attr('height', elemHeight)
    .attr('fill', i => {
      const isBlack = pitchNotes[i + (minVelocityNote?.note ?? 0)]?.charAt(1) === '#';
      return isBlack ? '#030918' : '#001629';
    });

  svg
    .selectAll('line.vertical')
    .data(Array.from({ length: columnCount + 1 }, (_, x) => x))
    .enter()
    .append('line')
    .attr('class', 'vertical')
    .attr('x1', x => x * elemWidth)
    .attr('y1', 0)
    .attr('x2', x => x * elemWidth)
    .attr('y2', rowsCount * elemHeight)
    .attr('stroke', '#FFFFFF')
    .attr('opacity', 0.2)
    .attr('stroke-width', x => (x + (minDeltaPositionNote?.attackTime ?? 0)) % 16 === 0 ? 3 : 1);

  svg
    .selectAll('line.horizontal')
    .data(Array.from({ length: rowsCount + 1 }, (_, y) => y))
    .enter()
    .append('line')
    .attr('class', 'horizontal')
    .attr('x1', 0)
    .attr('y1', y => y * elemHeight)
    .attr('x2', elemWidth * columnCount)
    .attr('y2', y => y * elemHeight)
    .attr('stroke', '#FFFFFF')
    .attr('opacity', 0.4)
    .attr('stroke-width', 1);

  svg
    .selectAll('rect.note')
    .data(notesArray, (_, note) => note)
    .enter()
    .append('rect')
    .attr('class', 'note')
    .attr('x', note => (note.attackTime - minDeltaPositionNote.attackTime) * elemWidth)
    .attr('y', note => (note.note - minVelocityNote.note) * elemHeight)
    .attr('width', note => note.duration * elemWidth)
    .attr('height', elemHeight)
    .attr('fill', '#030918')
    .attr('stroke', '#FFFFFF');

  return svg.node()?.outerHTML || '';
};