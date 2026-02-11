import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { addEffect as reduxAddEffect, removeEffect as reduxRemoveffect, moveEffect as reduxMoveEffect, Effect } from '../redux/slices/effectsSlice';
import { FXChain } from 'src/features/Effects/FXChain';

type AddEffectType = (effect: Effect) => void
type RemoveEffectType = (id: string) => void
type MoveEffectType = (effect: Effect, index: number) => void

export const useEffectsController = (onEffectAdded: AddEffectType, onEffectRemoved: RemoveEffectType, onEffectMoved: MoveEffectType ) => {
  const effects = useSelector((state: RootState) => state.effects.effects);
  const dispatch = useDispatch();
  //Venya, Let`s make FXChain a singletone. what do you think?
  // const chain = FXChain.Get();

  const addEffect: AddEffectType = (effect) => {
    dispatch(reduxAddEffect(effect));
    // chain.CreateFX(...);
    onEffectAdded(effect);
  }

  //Or input is (effect: Effect)
  const removeEffect: RemoveEffectType = (id) => {
    dispatch(reduxRemoveffect(id));
    const effect = effects.find(effect => effect.id === id);
    if (!!effect) {
      const index = effects.indexOf(effect);
      // chain.removeFX(index);
      onEffectRemoved(id);
    }
  }

  const moveEffect: MoveEffectType = (effect, index) => {
    dispatch(reduxMoveEffect({id: effect.id, toIndex: index}));
    const oldIndex = effects.indexOf(effect);
    // chain.moveFX(oldIndex, index);
    onEffectMoved(effect, index);
  }

  return { addEffect, removeEffect, moveEffect };
};
