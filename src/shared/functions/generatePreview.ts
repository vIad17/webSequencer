import * as d3 from 'd3';
import { clamp } from "../functions/math";
import { pitchNotes } from "../const/notes";
import { Note } from '../interfaces';

export const generatePreview = (
  notesArray: Note[],
  width: number = 344,
  height: number = 228
): string => {
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
  const deltaVelocity = clamp(defaultDeltaVelocity, 12, 48) + 1;

  const minDeltaPositionNote = notesArray[minNotePositionIndex];
  const maxDeltaPositionNote = notesArray[maxNotePositionIndex];
  const defaultDeltaPosition = maxDeltaPositionNote && minDeltaPositionNote
    ? maxDeltaPositionNote.attackTime + maxDeltaPositionNote.duration - minDeltaPositionNote.attackTime
    : 0;
  const deltaPosition = clamp(defaultDeltaPosition, 32, 128);

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
    .attr('opacity', 0.1)
    .attr('stroke-width', x => (x + (minDeltaPositionNote?.attackTime ?? 0)) % 16 === 0 ? 2 : 1);

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
    .attr('opacity', 0.1)
    .attr('stroke-width', 1);

  var filteredNotesArray  = notesArray.filter(note => note.note <= minVelocityNote.note + deltaVelocity && note.attackTime  <= minDeltaPositionNote.attackTime + deltaPosition);
  const notes = svg
    .selectAll('g.note-group')
    .data(filteredNotesArray , (_, note) => note)
    .enter()
    .append('g')
    .attr('class', 'note-group')
    .attr('transform', note =>
      `translate(${(note.attackTime - minDeltaPositionNote.attackTime) * elemWidth}, 
                ${(note.note - minVelocityNote.note) * elemHeight})`);

  notes
    .append('rect')
    .attr('class', 'note-outer')
    .attr('width', note => note.duration * elemWidth)
    .attr('height', elemHeight)
    .attr('fill', '#030918')
    .attr('stroke', '#FFFFFF')
    .attr('rx', 1)
    .attr('ry', 1);

  notes
    .append('rect')
    .attr('class', 'note-inner')
    .attr('x', note => (note.duration * elemWidth - elemWidth * 0.6))
    .attr('y', elemHeight * 0.1)
    .attr('width', elemWidth * 0.5)
    .attr('height', elemHeight * 0.8)
    .attr('fill', '#FFFFFF')

  return svg.node()?.outerHTML || '';
};